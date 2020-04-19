
let app = new Vue({
    el: '#app',
    data: {
        time_now: { hour: 13, min: 10 },
        crowded_now: '120',
        crowded_next: '120',
        input_time: '13:45',
        next_time: '13:45',
        selected_table_index: 1000,
        selected_dep_time: 0,
        isOpen: true,
        stop_selected: '技本',
        show_modal: false,
        stop_list: [
            {
                name: '技本',
                coords:{
                    lat:35.055519,
                    lng:137.160003
                }
            },
            {
                name: '10号館',
                coords:{
                    lat:35.054066,
                    lng:137.165388
                }
            }],
        recieved_data: [],
        bus_data: [], /* hour: ,min: ,  crowded:  */
        road_show_1: true,
        road_show_2: false
    },
    created: function (station) {
        this.delayFunc_update = _.debounce(this.update_schedule, 800);
        let that = this;
        this.timer = setInterval(function () {
            that.road_show_1 = !that.road_show_1;
            that.road_show_2 = !that.road_show_2;
        }, 500);
        if (navigator.geolocation) {
            let _this=this;
            navigator.geolocation.getCurrentPosition(
              function(position){
                let coords = position.coords;
                // 緯度経度だけ取得
                _this.lat = coords.latitude;
                _this.lng = coords.longitude;
                _this.accu=coords.accuracy;

                let min_dist=1000000000;
                for  (let stop of _this.stop_list){
                    console.log(stop);
                    console.log(min_dist);
                    console.log(stop.coords.lat)
                    const dist=_this.sphericalTrigonometry(stop.coords.lat,stop.coords.lng,_this.lat,_this.lng)
                    console.log(dist);

                    if(min_dist>dist)
                    {
                        min_dist=dist;
                        _this.stop_selected=stop.name;
                    }
                    console.log(_this.stop_selected);

                }
   
                
              },
              function(error) {
                // エラー処理を書く
              }
            );
          } else {
            // エラー処理を書く
          }        
    },
    mounted: function () {
        axios.get('https://m3e1tfriu4.execute-api.ap-northeast-1.amazonaws.com/BusApp/app', {
            params: {
                func: 'getBusData',
                input_time: this.input_time
            }
        })
            .then(response => {
                this.bus_data = response.data // .bodyなし
                console.log(this.bus_data)
            })
            .catch(response => console.log(response));
        /*
        axios.get('https://3435cwmvwf.execute-api.ap-northeast-1.amazonaws.com/BusApp')
        .then(response => {
            this.bus_data=response.data.body // .bodyあり
            console.log(this.bus_data)
        })
        .catch(response => console.log(response));
        */
        console.log(this.bus_data);
        this.time_now.hour = Number(this.bus_data[0].departure / 60);
        this.time_now.min = Number(this.bus_data[0].departure % 60);
    },
    computed: {
        localEmail: function () {
            return this.email.split('@')[0].toLowerCase();
        }
    },
    watch: {
        input_time: function (newValue, oldValue) {
            this.delayFunc_update();
        }
    },
    methods: {
        update_schedule: function (station) {
            axios.get('https://m3e1tfriu4.execute-api.ap-northeast-1.amazonaws.com/BusApp/app', {
                params: {
                    func: 'getBusData',
                    input_time: this.input_time
                }
            })
                .then(response => { this.bus_data = response.data })
                .catch(response => console.log(response));
        },
        parse_minutes: function (time_minutes) {
            return (time_minutes / 60 | 0) + ':' + this.zero_padding(time_minutes % 60, 2);
        },
        zero_padding: function (num, length) {
            return ('0000000000' + num).slice(-length);
        },
        selecting_stop: function (name) {
            this.stop_selected = name;
        },
        toIcon: function (rate) {
            if (rate < 80) {
                return "空き";
            } else if (rate < 130) {
                return "やや混雑";
            } else {
                return "混雑";
            }
        },
        get_time: function () {
            this.time_now = new Date();
        },
        get_time_from: function () {

        },
        activate_td: function (time) {
            this.selected_dep_time = time;
        },
        post_reminder: function (mailaddress) {
            console.log(mailaddress);
            console.log(this.selected_dep_time);

            axios.get('https://m3e1tfriu4.execute-api.ap-northeast-1.amazonaws.com/BusApp/app', {
                params: {
                    func: 'sendReminder',
                    mailaddress: mailaddress
                }
            })
                .then(response => {
                    console.log('sendReminder response:');
                    console.log(response);
                })
                .catch();
            this.toggle_modal();

            /*axios.post('https://3435cwmvwf.execute-api.ap-northeast-1.amazonaws.com/BusApp/sendReminder',{
                address: mailaddress,
                time:this.selected_dep_time
            })
            .then(function (response){
                console.log(response);
            })
            .catch(function(error){
                console.log(error);
            });*/
        },
        toggle_modal: function () {
            this.show_modal = !this.show_modal;
        },
        sphericalTrigonometry:function(lat1, lng1, lat2, lng2) {
            // 赤道半径
            const R = 6378137.0;
        
            function rad(deg) {
                return deg * Math.PI / 180;
            }
        
            return R *
                Math.acos(
                    Math.cos(rad(lat1)) *
                    Math.cos(rad(lat2)) *
                    Math.cos(rad(lng2) - rad(lng1)) +
                    Math.sin(rad(lat1)) *
                    Math.sin(rad(lat2))
                );
        }
    }
});
