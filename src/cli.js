import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--typescript": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      "argv": rawArgs.slice(2),
    },
  );

  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "Create React App";
  if (options.skipPrompts) {
    return {
      ... options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      template: "Please choose which template to use.",
      choices: ["Create React App", "Next"],
      default: defaultTemplate,
    })
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initalize a Git repository?",
      default: false,
    })
  }

  if (!options.typescript) {
    questions.push({
      type: "confirm",
      name: "typescript",
      message: "Initalize Typescript in project?",
      default: false
    })
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  // console.log(options);   // check options
  await createProject(options);
}