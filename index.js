import inquirer from "inquirer";
import chalk from "chalk";
import { nanoid } from "nanoid";
import * as fs from "node:fs";

function app() {
    // create a json file if dont have one yet
    createDatabase();

    // options to user choose
    inquirer.prompt(
        [
            {
                type: "list",
                name: "option",
                message: "🖊️  TodoApp",
                choices: [
                    "Adicionar tarefa.",
                    "Listar tarefas.",
                    "Remover tarefa."
                ]
            },
        ]
    )
    .then(answer => {
        const option = answer["option"];

        if (option === "Adicionar tarefa.")
            addTask();

        else if (option === "Listar tarefas.")
            showTasks();
    })
}

function addTask() {
    inquirer.prompt(
        [
            {
                name: "task",
                message: "➕ Digite a tarefa que deseja adicionar:"
            }
        ]
    )
    .then(answer => {
        const task = answer["task"];

        const data = openData();
        const tasks = data.tasks;

        tasks.push(
            {
                value: nanoid(),
                name: task,
            }
        )

        data.tasks = tasks;
        updateData(data);

        app();   
    })
}

function showTasks() {
    const data = openData();
    const tasks = data.tasks;

    if (tasks.length == 0) {
        console.log(chalk.bgYellow.black.bold("Não há tarefas para exibir."))
        return app();
    }

    inquirer.prompt([
        {
            type: "checkbox",
            name: "selecteds",
            message: "✔️  Selecione e envie as tarefas que já completou.",
            choices: tasks
        }
    ])
    .then(answer => {
        const selecteds = answer['selecteds'];

        // find and remove selecteds tasks
        for (let selectedIndex = 0; selectedIndex < selecteds.length; selectedIndex++) {
            for (let tasksIndex = 0; tasksIndex < tasks.length; tasksIndex++) {
                if (selecteds[selectedIndex] == tasks[tasksIndex].value) {
                    tasks.splice(tasksIndex, 1);
                }
            }
        }

        data.tasks = tasks;
        updateData(data);
        app();
    })
}

function openData() {
    if (!fs.existsSync("data.json"))
        createDatabase();

    const data = fs.readFileSync(
        "data.json",
        {
            encoding: "utf-8",
            flag: "r"
        }, 
        err => console.log(err)
        );

    return JSON.parse(data);
}

function updateData(data) {
    if (!fs.existsSync("data.json")) 
        createDatabase();
    
    fs.writeFileSync(
        'data.json', 
        JSON.stringify(data, null, 4), 
        err => console.log(err)    
    );
}

function createDatabase() {
    if (fs.existsSync("data.json"))
        return;

    const model = {
        tasks: []
    }

    fs.writeFileSync(
        "data.json",
        JSON.stringify(model, null, 4),
        err => console.log(err)
    );
}

app();