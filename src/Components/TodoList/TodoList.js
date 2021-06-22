import ProjectAdd from '../ProjectAdd/ProjectAdd'
import ProjectList from '../ProjectList/ProjectList'
import ProjectTask from '../ProjectTask/ProjectTask'
import React from 'react';
import styles from './TodoList.module.scss';
import classnames from 'classnames/bind'
import { Switch, Route, Link, Redirect } from "react-router-dom"

const cx = classnames.bind(styles)

const projects = [
    {
        id: 1, name: 'Domecticity', tasks: [
            { id: 1, name: 'Task 1', description: 'Description 1', completed: false },
            { id: 2, name: 'Task 2', description: 'Description 2', completed: true },
            { id: 3, name: 'Task 3', description: 'Description 3', completed: false }
        ]
    },
    {
        id: 2, name: 'Uni', tasks: [
            { id: 4, name: 'Task 4', description: 'Description 4', completed: true },
            { id: 5, name: 'Task 5', description: 'Description 5', completed: false },
            { id: 6, name: 'Task 6', description: 'Description 6', completed: true }
        ]
    }
]

const normalizeState = () => {
    const normalizeBy = key => {
        return (data, item) => {
            data[item[key]] = item
            return data
        }
    }
    const normalizedTasks = projects
        .map(project => project.tasks)
        .flat()
        .reduce(normalizeBy("id"), {})

    const normalizedProjects = projects
        .map(project => ({
            ...project,
            tasks: project.tasks.map(task => task.id),
        }))
        .reduce(normalizeBy("id"), {})

    const state = {
        projectsById: normalizedProjects,
        tasksById: normalizedTasks,
        taskName: '',
        taskDescription: ''
    }

    return state
}

class TodoList extends React.Component {
    state = normalizeState(projects)

    changeCompletedStatus = (id) => {
        const oldTask = this.state.tasksById[id]
        const newTask = { ...oldTask, completed: !oldTask.completed }
        this.setState(currentState => ({
            tasksById: {
                ...currentState.tasksById, [id]: newTask
            }
        }
        ))
    }

    addNewProject = (name) => {
        const projectId = Object.keys(this.state.projectsById).length + 1
        const newProject = {
            id: projectId,
            name: name,
            tasks: []
        }
        this.setState(currentState => {
            const newProjects = { ...currentState.projectsById }
            newProjects[projectId] = newProject

            return {
                projectsById: newProjects
            }
        })
    }

    handleChange = (event) => {
        const { value, name } = event.currentTarget
        this.setState({ [name]: value })
    }

    addNewTask = (event) => {
        const { value: projectId } = event.currentTarget
        const taskId = Object.keys(this.state.tasksById).length + 1
        const newTask = {
            id: taskId,
            name: this.state.taskName,
            description: this.state.taskDescription,
            completed: false
        }
        this.setState(currentState => {
            const newTasks = { ...currentState.tasksById }
            newTasks[taskId] = newTask
            const newProjects = { ...currentState.projectsById }
            newProjects[projectId] = { ...newProjects[projectId] }
            newProjects[projectId].tasks = [...newProjects[projectId].tasks, taskId]
            return {
                tasksById: newTasks,
                projectsById: newProjects
            }
        })

    }

    render() {
        return (
            <div className={cx("container")}>
                <Switch>
                    <Route path="/">
                    <div className={cx("project_container")}>
                        <Link to="/projects"><div className={cx("h1")}>projects</div></Link>
                        <Route path="/projects">
                                <ProjectAdd addNewProject={this.addNewProject} handleChange={this.handleChange} />
                                <ProjectList projectsById={this.state.projectsById} handleProjectClick={this.handleProjectClick} />
                        </Route>
                        </div>
                    </Route>
                </Switch>
                <Switch>
                    <Route path='/projects/:projectId/'>
                        <div className={cx("tasks_container")}>
                        <ProjectTask projectsById={this.state.projectsById}
                            tasksById={this.state.tasksById}
                            changeCompletedStatus={this.changeCompletedStatus}
                            addNewTask={this.addNewTask}
                            taskName={this.state.taskName}
                            taskDescription={this.state.taskDescription}
                            handleChange={this.handleChange}
                        />
                        </div>
                    </Route>
                    <Redirect to='/' />
                </Switch>
            </div>
        )
    }
}

export default TodoList;