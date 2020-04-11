
let app = new Vue({
    el: '#app',
    data: {
        time_now:{hour:13,min:10},
        crowded_now: '120',
        crowded_next : '120',
        input_time: '13:45',
        next_time:'13:45',
        test_text:'テスト',
        stop_list:[
            {
                name:'技本'
            },
            {
                name:'10号館'
            }],
        stop_now:'技本',
        recieved_data: [] ,
        bus_data:[], /* hour: ,min: ,  crowded:  */
        schedule:[
            {
                hour: '13',
                min:'45',
                crowded :'200',
                status:'満車'
            },
            {
                time:'14:00',
                crowded : '150',
                status:'混雑'
            },
            {
                time:'14:15',
                crowded : '130',
                status:'混雑'
            },
            {
                time:'14:30',
                crowded : '80',
                status:'空き'
            },
            {
                time:'14:45',
                crowded : '50',
                status:'空き'
            },
            {
                time:'15:00',
                crowded : '70',
                status:'空き'
            }
        
        ],
        users: []
    },
    created:function(station){
        this.delayFunc_update=_.debounce(this.update_schedule,800);
    },
    mounted :function(){
        axios.get('https://3435cwmvwf.execute-api.ap-northeast-1.amazonaws.com/BusApp')
              .then(response => {
                  this.bus_data=response.data
                  console.log(this.bus_data)
              })
              .catch(response => console.log(response));
        this.time_now.hour=Number(this.bus_data[0].hour);
        this.time_now.min=Number(this.bus_data[0].min);
        },

    computed : {
        localEmail: function(){
            return this.email.split('@')[0].toLowerCase();
        }
    },

    watch:{
        input_time:function(newValue, oldValue){
            this.delayFunc_update();
        }
    },

    methods:{
        update_schedule: function(station){
            axios.get('https://jsonplaceholder.typicode.com/users'+this.station+'/'+this.input_time)
            .then(response => this.recieved_data=response.data)
            .catch(response => console.log(response));
        },
        onclick_change_stop: function(stop){
            this.stop_now=stop;
        },
        onlick_test: function(){
            this.test_text='あああ';
        },
        onclick_nexthour:function(){
            this.next_time="1:00";
        },
        toIcon:function(rate){
            if (rate<80)
            {
                return "空き";
            } else if(rate<130)
            {
                return "やや混雑";
            } else{
                return "混雑";
            }

        },
        get_time:function(){
            this.time_now=new Date();
        },
        get_time_from:function(){
            
            
        }
    }
    
});
