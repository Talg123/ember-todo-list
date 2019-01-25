import Component from '@ember/component';
import $ from 'jquery';
import {inject as service} from '@ember/service';

export default Component.extend({

    rerender: service(),
    init(){
        this._super();
        this.showInput = false;
        this.todo = "";
    },
    actions:{
        /**
         * show\hide the popup with the input
         */
        showInput(){
            if(this.showInput){
                this.set("showInput",false);
            }else{
                this.set("showInput",true);
            }
        },
        /**
         * submit the input and create new note
         */
        submit(){
            var _this = this;
            //check if the input is not empty
            if(this.todo.trim().length > 0){
                $.post("http://localhost:8000/notes/create",{content:this.todo},function(data){
                    if(data.data.id){
                        _this.set("showInput",false);
                        _this.get('rerender').sendData(true);
                        _this.set("todo","");
                    }
                })
            }
        }
    }
});
