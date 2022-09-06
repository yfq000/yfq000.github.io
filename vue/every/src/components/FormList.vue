<script>
import form_data from '../form_data.js'   
export default {
    data() {
        return {
            list: {},
            form_data
        }
    },
    mounted() {
        Object.keys(form_data).forEach(item => {
            let l0 = item.slice(0, item.indexOf('_'));
            if (!this.list.hasOwnProperty(l0)) {
                this.list[l0] = new Array();
            }
            this.list[l0].push(item);
        });
        this.form_data = form_data;
    }
}
</script>

<template>
    <div v-for="(links, key) in list">
        <h4>{{form_data.list[key]}}</h4>
        <nav>
            <a v-for="link in links" :href="'?'+link">{{form_data[link].title}}</a>
        </nav>
    </div>
</template>
<style scoped>
h4 {
    text-align: center;
}
nav {
    width: 100%;
    font-size: 15px;
    text-align: center;
    margin-bottom: 2rem;
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
</style>