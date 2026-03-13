import chalk from "chalk";

export const logger = {
  // 1. Result/Success Method
  result: (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `${chalk.gray(`[${timestamp}]`)} ${chalk.green.bold("✔ RESULT:")} ${chalk.white(message)}`,
    );
    if (data) {
      console.log(chalk.gray("Data:"), JSON.stringify(data, null, 2));
    }
  },

  // 2. Error Method
  error: (message: string, trace?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.error(
      `${chalk.gray(`[${timestamp}]`)} ${chalk.red.bold("✖ ERROR:")} ${chalk.red(message)}`,
    );
    if (trace) {
      console.error(chalk.red.dim("Trace:"), trace);
    }
  },
};
