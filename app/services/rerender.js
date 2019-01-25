import Service from '@ember/service';
import ember from 'ember';

export default Service.extend(ember.Evented,{

    sendData(data){
        this.trigger('data-income',data);
    }
});
