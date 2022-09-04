<script>
import form_data from '../form_data.js'
let curl = "property";
export default {
    data() {
        return {
            form: {}
        }
    },
    methods: {
        clac(event) {
            this.form.method()
        }
    },
    mounted(){
        const curForm = window.location.search.slice(1);
        if (form_data.hasOwnProperty(curForm)) {
            this.form = form_data[curForm];
        }
    },
   
    
}
</script>

<template>
    <div>
        <nav>
            <a href="?property">pro</a>
            <a href="?pipe_diameter_velocity">pipe_diameter_velocity</a>
        </nav>    
        <h3>{{form.title}}</h3>
        <p v-for="(arg, key) in form.args">
            <label :for="key">{{arg.title}}</label>
            <input :type="arg.type" :class="key" v-if="arg.html_tag == 'input'" v-model="arg.value" :placeholder="arg.default_value">
            <select v-if="arg.html_tag == 'select'">
                <option v-for="option in form.options[key]" :value="option.value">
                    {{option.text}}
                </option>
            </select>
            <span>{{arg.unit}}</span>
        </p>
        <p>结果<button @click="clac">计算</button></p>
        <p v-for="(item, key) in form.results">
            <label :for="key">{{item.title}}</label>
            <span>{{item.value}}</span>
            <span>{{item.unit}}</span>
        </p>
    </div>
</template>

<style scoped>
nav {
  width: 100%;
  font-size: 15px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
    h3 {
      margin-left: 135px;
    }
    p {
        display: flex;
        margin: 5px 0;
    }
    label {
        width: 120px;
        text-align: right;
        margin-right: 15px;
    }
    span {
        margin-left: 15px;
    }
    </style>