#!/usr/bin/env node
import * as readline from 'readline'
import yargs from 'yargs'
import { hideBin} from "yargs/helpers";
import {execSync} from "node:child_process";
import * as path from 'node:path'
import * as fs from "node:fs";

const argv = yargs(hideBin(process.argv)).parse()

const TEMPLATE_REPO_URL = 'https://github.com/knaw-huc/panoptes-template'

const createInterface = () => {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
}

const askQuestion = (rl, question: string) => {
    return new Promise<string>(resolve => {
        rl.question(question, (answer: string) => {
            resolve(answer);
        })
    })
}

const getProjectName = async () => {
    let projectName: string = argv['name'];

    if (!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, "Enter project name: ");
        rl.close();
    }

    return projectName;
}

const execCommand = (command, options = {}) => {
    try {
        execSync(command, {stdio: 'inherit', ...options});
    }
    catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
}

const setupRepository = async (projectName: string) => {
    execCommand(`git clone --depth=1 ${TEMPLATE_REPO_URL} ${projectName}`)

    const projectPath = path.join(process.cwd(), projectName);
    execCommand('npm install', {cwd: projectPath});
    fs.rmSync(path.join(projectPath, '.git'), {recursive: true});
    execCommand('git init', {cwd: projectPath});
    execCommand('git add .', {cwd: projectPath});
    execCommand('git commit -m "Initial commit"', {cwd: projectPath});
}

const main = async() => {
    console.log("Create Panoptes");
    const projectName = await getProjectName();
    console.log(`Your project name: ${projectName}`);
    await setupRepository(projectName);
}

main().catch(console.error)