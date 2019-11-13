import Docker from "dockerode";
import { ScreenshotServer } from "./api";

const DOCKER_IMAGE_TAG_NAME = "fwouts/chrome-screenshot";
const DOCKER_IMAGE_VERSION = "0.0.3";
const DOCKER_IMAGE_TAG = `${DOCKER_IMAGE_TAG_NAME}:${DOCKER_IMAGE_VERSION}`;

/**
 * A screenshot server running inside a Docker container (which runs Chrome) to
 * ensure that screenshots are consistent across platforms.
 */
export class DockerizedScreenshotServer implements ScreenshotServer {
  private readonly docker: Docker;
  private container: Docker.Container | null = null;

  constructor(private readonly port: number) {
    this.docker = new Docker({ socketPath: "/var/run/docker.sock" });
  }

  async start() {
    if (this.container) {
      throw new Error(
        `Container is already started! Please only call start() once.`
      );
    }
    await ensureDockerImagePresent(this.docker);
    await removeLeftoverContainers(this.docker);
    this.container = await startContainer(this.docker, this.port);
  }

  async stop() {
    if (!this.container) {
      throw new Error(
        `Container is not started! Please make sure that start() was called.`
      );
    }
    await this.container.kill();
    await this.container.remove();
  }
}

async function ensureDockerImagePresent(docker: Docker) {
  const images = await docker.listImages({
    filters: {
      reference: {
        [DOCKER_IMAGE_TAG]: true
      }
    }
  });
  if (images.length === 0) {
    throw new Error(
      `It looks like you're missing the Docker image required to render screenshots.\n\nPlease run the following command:\n\n$ docker pull ${DOCKER_IMAGE_TAG}\n\n`
    );
  }
}

async function removeLeftoverContainers(docker: Docker) {
  const existingContainers = await docker.listContainers();
  for (const existingContainerInfo of existingContainers) {
    const [name] = existingContainerInfo.Image.split(":");
    if (name === DOCKER_IMAGE_TAG_NAME) {
      const existingContainer = await docker.getContainer(
        existingContainerInfo.Id
      );
      if (existingContainerInfo.State === "running") {
        await existingContainer.stop();
      }
      await existingContainer.remove();
    }
  }
}

async function startContainer(docker: Docker, port: number) {
  const container = await docker.createContainer({
    Image: DOCKER_IMAGE_TAG,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false,
    ExposedPorts: {
      [`3000/tcp`]: {}
    },
    HostConfig: {
      PortBindings: {
        [`3000/tcp`]: [{ HostPort: `${port}` }]
      }
    }
  });
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true
  });
  await new Promise<void>(resolve => {
    stream.on("data", message => {
      if (message.toString().indexOf("Ready.") > -1) {
        resolve();
      }
    });
  });
  return container;
}
