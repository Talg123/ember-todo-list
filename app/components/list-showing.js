import Component from '@ember/component';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import {set as emberset} from '@ember/object';

export default Component.extend({

    rerender:service(),
    init(){
        this._super();
        this.getList();
        var _this = this;
        //retrive changes from service
        this.get("rerender").on("data-income",function(data){
            if(data){
                _this.getList();
            }
        })
    },

    actions:{
        /**
         * remove a specific note from the list
         * @param {*} todo 
         */
        removeFromList(todo){
            var _this = this;
            $.ajax({
                url: 'http://localhost:8000/notes/del/',
                type: 'DELETE',
                data:{id:todo.id},
                contentType:'application/x-www-form-urlencoded; charset=UTF-8',
                success: function(data) {
                   if(data.data){
                        var newList = _this.list.filter(function(singleTodo){
                            if(singleTodo.id != todo.id){
                                return true;
                            }
                        })
                        _this.set("list",newList);
                        _this.updateCountersList();
                        
                   }
                }
            });

        },
        /**
         * updates the is_completed attribute of a specific note
         * @param {*} theTodo 
         */
        updateComplete(theTodo){
            emberset(theTodo,'is_completed' ,theTodo.is_completed ? 0:1);
            var _this = this;
            $.ajax({
                url:"http://localhost:8000/notes/update",
                method:"PUT",
                data:{id:theTodo.id,content:theTodo.content,is_completed:theTodo.is_completed},
                dataType:"json",
                success:function(data){
                    if(data){
                        if(theTodo.is_completed){
                            _this.set("listCompleted",_this.get("listCompleted")+1);
                            _this.set("listUnCompleted",_this.get("listUnCompleted")-1);
                        }else{
                            _this.set("listCompleted",_this.get("listCompleted")-1);
                            _this.set("listUnCompleted",_this.get("listUnCompleted")+1);
                        }
                    }
                }
            })
        },
        /**
         * show\hide input to edit the note
         * @param {*} todo 
         */
        changeEditMode(todo){
            if(!todo.editMode){
                emberset(todo,"editMode",true);
            }else{
                this.updateContent(todo);
            }
        },
    },
    /**
     * retrive the list of notes from the DB
     * using Laravel API Endpoint
     */
    getList(){
        var _this = this;
        $.getJSON("http://localhost:8000/notes",function(data){
            if(data.data.length > 0){
                var listToShow = data.data.map(function(todo){
                    todo['editMode'] = false;
                    return todo;
                })
                _this.set("list",listToShow);
                _this.updateCountersList();
            }
        })
    },
    /**
     * update the content of a specific note
     * @param {*} theTodo 
     */
    updateContent(theTodo){
        $.ajax({
            url:"http://localhost:8000/notes/update",
            method:"PUT",
            data:{id:theTodo.id,content:theTodo.content,is_completed:theTodo.is_completed},
            dataType:"json",
            success:function(data){
                if(data){
                    emberset(theTodo,"editMode",false);
                }
            }
        })
    },
    /**
     * update the counters of the note list
     */
    updateCountersList(){
        var _this = this;
        var list = this.get('list');
        var counter=0;
        list.forEach(function(todo){
            if(todo.is_completed){
                counter++;
            }
        })
        _this.set("listCompleted",counter);
        _this.set("listUnCompleted",list.length - counter);
    }
});
