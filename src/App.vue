<template>
	<div id="app">
		<div class="main-navbar">
            <!-- не локализовано -->
            <h1 class="main-navbar-title">Tasks</h1>
        </div>
        <TaskProgress :progress="progress"/>
        <!-- можно просто @create-new-task="createNewTask" -->
        <TaskForm @create-new-task="createNewTask($event)"/>
        <TaskGrid
            @task-delete="taskDelete($event)"
            @task-toggle="taskToggle($event)"
        />
	</div>
</template>

<script>
import TaskProgress from "@/components/TaskProgress.vue"
import TaskForm from "@/components/TaskForm.vue"
import TaskGrid from "@/components/TaskGrid"

export default {
    // нет имени компонента 
    components: {TaskProgress, TaskForm, TaskGrid},

// created(){ каноничнее
    created: function() {
        // работа с данными должна быть в сторе, не в представлении
        // работа с Local-Session Storage следовало вынести в отдельный компонент, где обрабатывались бы ошибки доступа
        const json = localStorage.getItem('tasks');
        // нет перехвата исключения
        this.tasks = JSON.parse(json) || [];
    },

    computed: {
        // не должно быть возможности устанавливать значение для computed поля
        tasks: {
            get: function() {
                // прямое обращение к состоянию, вместо вызова метода-геттера
               return this.$store.state.tasks
            },
            set: function(value) {
                // прямой вызов commit, вместо вызова action
                this.$store.commit('updateTasks', value)
            }
        },
        tasksDoneCount() { return this.tasks.filter(arr => !arr.pending).length },
		progress() {
            return this.tasks.length === 0 ? 0 : Math.round( 100 / this.tasks.length * this.tasksDoneCount);
        },
	},

    watch: {
        tasks: {
            deep: true,
            handler() {
                        // работа с данными должна быть в сторе, не в представлении
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
            }
        }
    },

    methods: {
        // все эти методы следовало разместить в vuex сторе
        createNewTask(taskTitle) {
            this.tasks.push({
                title: taskTitle,
                pending: true,
            })
        },

        taskDelete(i) {
            this.tasks.splice(i, 1);
        },

        taskToggle(i) {
            this.tasks[i].pending = !this.tasks[i].pending;
        },
    }
}
</script>

<style>
/* глобальные стили лучше хранить отдельных стилях */
* {
    box-sizing: border-box;
    user-select: none;
}

h1, h2, h3 {
    margin: 0;
}

body {
    font-family: 'Lato', sans-serif;
    background: linear-gradient(to right, rgb(22, 34, 42), rgb(58, 96, 115));
    color: #FFF;
    margin: 0;
}

.main-navbar {
    text-align: center;
}

/* хорошая практика вынести шрифты в миксины и добавлять в компоненты, чтобы поддерживать консистетность  */
.main-navbar-title {
    margin-top: 10px;
    font-weight: 300;
    font-size: 2rem;
}
@media (min-width: 576px) {
    .main-navbar-title {
        margin-top: 20px;
        font-size: 3rem;
    }
}
</style>
