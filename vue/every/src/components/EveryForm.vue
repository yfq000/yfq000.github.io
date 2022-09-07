<script>
import form_data from '../form_data.js'
let curl = "property";
export default {
    data() {
        return {
            form: [],
            list: {},
            formData: {}
        }
    },
    methods: {
        clac() {
            this.form.forEach(item => {item.method();});
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
        
        this.formData = form_data;
    },
}
</script>

<template>
    <div>   
        <p v-if="form.length > 0">> {{form[0].title}}</p>
        <div v-for="item in form">
            <p v-for="(arg, key) in item.args">
                <label :for="key">{{arg.title}}</label>
                <input :type="arg.type" :name="key" v-model="arg.value" v-if="arg.html_tag=='input'">
                <select :name="key" v-model="arg.value" v-if="arg.html_tag=='select'">
                    <option v-for="option in item.options[key]" :value="option.value">{{option.text}}</option>
                </select>
                <span>{{arg.unit}}</span>
            </p>
            <p v-for="(result, key) in item.results">
                <label :for="key">{{result.title}}</label>
                <span>{{result.value}}</span>
                <span>{{result.unit}}</span>
            </p>
        </div>
        <p v-if="form.length > 0">
            <button @click="clac">计算</button>
        </p>

    </div>
</template>

<style scoped>
p {
    display: flex;
    padding: 0.2rem 1rem;
}
label {
    width: 120px;
    text-align: right;
    margin: 0 1rem;
}
span {
    margin-left: 1rem;
}
button {
    margin-left: 10rem;
}
</style>