import chalk from "chalk";
import Docker from "dockerode";
import { debugLogger } from "../logger";
import { ScreenshotServer } from "./api";
import { getLoggingLevel } from "./config";

const DOCKER_IMAGE_TAG_NAME = "fwouts/chrome-screenshot";
const DOCKER_IMAGE_VERSION = "1.2.1";
const DOCKER_IMAGE_TAG = `${DOCKER_IMAGE_TAG_NAME}:${DOCKER_IMAGE_VERSION}`;

const logDebug = debugLogger("DockerizedScreenshotServer");

/**
 * A screenshot server running inside a Docker container (which runs Chrome) to
 * ensure that screenshots are consistent across platforms.
 */
export class DockerizedScreenshotServer implements ScreenshotServer {
  private readonly docker: Docker;

  private container: Docker.Container | null = null;

  constructor(private readonly port: number) {
    this.docker = new Docker({
      socketPath:
        process.platform === "win32"
          ? "//./pipe/docker_engine"
          : "/var/run/docker.sock",
    });
  }

  async start() {
    logDebug(`DockerizedScreenshotServer.start() initiated.`);
    if (this.container) {
      throw new Error(
        "Container is already started! Please only call start() once."
      );
    }

    logDebug(`Ensuring that Docker image is present.`);
    await ensureDockerImagePresent(this.docker);

    logDebug(`Removing any old Docker containers.`);
    await removeLeftoverContainers(this.docker);

    logDebug(`Starting Docker container.`);
    this.container = await startContainer(this.docker, this.port);
    logDebug(`Docker container started.`);
  }

  async stop() {
    logDebug(`DockerizedScreenshotServer.stop() initiated.`);
    if (!this.container) {
      throw new Error(
        "Container is not started! Please make sure that start() was called."
      );
    }

    logDebug(`Killing Docker container.`);
    await this.container.kill();
    logDebug(`Docker container killed.`);

    logDebug(`Removing Docker container.`);
    await this.container.remove();
    logDebug(`Docker container removed.`);
  }
}

async function ensureDockerImagePresent(docker: Docker) {
  const images = await docker.listImages({
    filters: {
      reference: {
        [DOCKER_IMAGE_TAG]: true,
      },
    },
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
      // eslint-disable-next-line no-await-in-loop
      const existingContainer = await docker.getContainer(
        existingContainerInfo.Id
      );
      if (existingContainerInfo.State === "running") {
        // eslint-disable-next-line no-await-in-loop
        await existingContainer.stop();
      }
      // eslint-disable-next-line no-await-in-loop
      await existingContainer.remove();
    }
  }
}

async function startContainer(docker: Docker, port: number) {
  let hostConfig: Docker.ContainerCreateOptions["HostConfig"] = {
    PortBindings: {
      "3001/tcp": [{ HostPort: `${port}` }],
    },
  };
  if (process.platform === "linux") {
    hostConfig = {
      NetworkMode: "host",
    };
  }

  const container = await docker.createContainer({
    Image: DOCKER_IMAGE_TAG,
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: false,
    StdinOnce: false,
    ExposedPorts: {
      "3001/tcp": {},
    },
    Env: [`SCREENSHOT_LOGGING_LEVEL=${getLoggingLevel()}`],
    HostConfig: hostConfig,
  });
  await container.start();
  const stream = await container.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  await new Promise<void>((resolve) => {
    stream.on("data", (message) => {
      if (getLoggingLevel() === "DEBUG") {
        console.log(chalk.yellow(`Docker container output:\n${message}`));
      }
      if (message.toString().indexOf("Ready.") > -1) {
        resolve();
      }
    });
  });
  return container;
}
