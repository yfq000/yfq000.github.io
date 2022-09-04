<script>
import form_data from '../form_data.js'
let curl = "property";
export default {
    data() {
        return {
            form: []
        }
    },
    methods: {
        clac() {
            console.log(this.form);
            //this.form.method()
        },
        add() {
            const curForm = window.location.search.slice(1);
            if (form_data.hasOwnProperty(curForm)) {
                this.form.push(form_data[curForm]);
            }
        }
    },
    mounted(){
        const curForm = window.location.search.slice(1);
        if (form_data.hasOwnProperty(curForm)) {
            this.form.push(form_data[curForm]);
        }
        console.log(this.form[0].title);
    },
   
    
}
</script>

<template>
    <div>
        <nav>
            <a href="?property">pro</a>
            <a href="?pipe_diameter_velocity">pipe_diameter_velocity</a>
        </nav>    
        
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