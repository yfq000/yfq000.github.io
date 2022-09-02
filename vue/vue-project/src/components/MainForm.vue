<script>
import form_data from '../../form_data.js'
let curl = "property";
export default {
    data() {
        return {
            title:'',
            args: {},
            options: {},
            isMultiple: false
        }
    },
    mounted(){
        this.title = form_data[curl].title;
        this.args =  form_data[curl].args;
        this.options = form_data[curl].options;
        this.isMultiple = form_data[curl].isMultiple;
    }
}
</script>

<template>
    <div>
        <h3>{{title}}</h3>
        <p v-for="(item, key) in args">
            <label :for="key">{{item.title}}</label>
            <input :type="item.type" :value="item.default_value" :class="key" v-if="item.html == 'input'">
            <select v-if="item.html == 'select'">
                <option v-for="option in options[key]" :value="option.value">
                    {{option.text}}
                </option>
            </select>
            <span>{{item.unit}}</span>
        </p>
    </div>
</template>

<style scoped>
h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  text-align: center;
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