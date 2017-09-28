<template>
  <div class="details">
    <header>
        <span>{{member_info.name}}</span>
        <div class='details_avatar'>
            <img :src="member_info.avatar">
        </div>
    </header>
    <div class="total">
        <div class="money"><strong>{{ clock_info.sum_price }}</strong><br>累计奖励(元)</div>
        <div class="count"><strong>{{ clock_info.sum_clock_day }}</strong><br>累计成功次数</div>
    </div>
    <div class='calendar'>
        <h2 v-model='month'>
            <span style='float: left;' @click='preMonth'><i class="iconfont icon-pre"></i></span>
            {{month}}月
            <span style='float: right;transform:rotate(180deg);' @click='nextMonth'><i class="iconfont icon-pre"></i></span>
        </h2>
        <ul>
            <!--<span v-if=''></span>-->
            <li v-for='(n, index) of days' @click='click_date(n)' :class='{active:n==i ,checkedIn: k.indexOf(n)!=-1 ,icon: r.indexOf(n)!=-1, fail: f.indexOf(n) !== -1 }' v-model='i'>
                <span>{{n}}</span>
            </li>
        </ul>
    </div>
    <div class='record'>
        <div class='no' v-if='!isPay'>本日无挑战记录</div>
        <div class='yes' v-else>
            <div class='content'>
                <p class='first'>
                    <span>早起打卡</span>
                    <span v-if='time'>挑战成功</span>
                    <span v-else style='color: #D9534F'>挑战失败</span>
                </p>
                <p class='second'>
                    <span v-if='time'>我在{{time | format}}起床，连续早起第{{ countDay }}天啦!</span>
                    <span v-else>{{ fail }}人瓜分了我的挑战金!</span>
                    <img src="./medal.png" height='20' v-if='r.indexOf(i) != -1' />
                </p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'details',
  data () {
    return {
        member_info: {},
        clock_info: {},
        date_clock: {},
        year: '',
        month: '',
        isWatch: false,           // 是否开启监控month的变化
        i: '',   // 判断当前的点击 把n传给i 进行比较
        k: [],   // 当月签到过的天数的数组
        f: [],    // 当月失败的天数的数组
        r: [],    // 当月有勋章的天数的数组
        okList: [],                 // 签到过的日期的数组
        activeDate: '',           // 当前点击的日期
        time: '',                 // 当前点击的天数的签到时间
        isPay: true,               // 是否参加挑战
        fail: 0,
        cont_day: [],               // 存放连续打卡天数
        isClick: false,
        number: 0                 // 记录上一次的连续打卡天数 对应的countDay
    }
  },
  created () {
    this.$http.get('http://clock.17link.cc/api/member/info').then(res => {
      this.member_info = res.data;
    })
    this.$http.get('http://clock.17link.cc/api/clock/info').then(res => {
      this.clock_info = res.data.data;
    })   
    this.year = new Date().getFullYear();
    let month = this.month = new Date().getMonth() + 1;
    this.activeDate = this.i = new Date().getDate();
    if(month < 10) month = '0' + month;
    this.$http.get(`http://clock.17link.cc/api/clock/date_clock?date=${this.year}-${month}`).then(res => {
        this.date_clock = res.data.data;      
        this.date_clock.forEach(item => {
            let countDay = item.cont_clock_day;
            if(item.clock_time){
                let d = item.clock_time.substr(8, 2);
                let h = item.clock_time.substr(11, 2);
                let m = item.clock_time.substr(14, 2);
                let list = `${d}${h}${m}`;
                this.okList.push(list);
                this.cont_day.push(item.cont_clock_day);
                if(Number.parseInt(d.substr(0, 1))){
                    this.k.push(parseInt(d.substr(0, 2)));
                }else{
                    this.k.push(parseInt(d.substr(1, 1)));
                }
            }else{
                let fail = item.date_time.substr(8 ,2);
                if(Number.parseInt(fail.substr(0, 1))){
                    this.f.push(parseInt(fail.substr(0, 2)));
                }else{
                    this.f.push(parseInt(fail.substr(1, 1)));
                }
            }
            
            if(countDay <= 30){
                if(countDay == 3 || countDay == 5 || countDay == 10 || countDay == 15 || countDay == 18 || countDay == 20 || countDay == 21 || countDay == 30){
                    this.r.push(Number.parseInt(item.clock_time.substr(8, 2)));
                    console.log(1);
                }
            }
            else if( !(countDay - 30) % 10 ){
                this.r.push(Number.parseInt(item.clock_time.substr(8, 2)));
            }
        })
    })
    this.$http.get('http://clock.17link.cc/api/clock').then(res => {
        this.fail = res.data.history_num - res.data.history_clock_num;
    })
    this.$http.get(`http://clock.17link.cc/api/clock/date_clock?date=${this.year}-${month}-${this.i}`).then(res => {
        let x = res.data.data[0];
        if(x.clock_time){
            this.isPay = true;
            this.time = x.clock_time.substr(11, 2) + x.clock_time.substr(14, 2);
            this.isClick = true;
        }
    })
  },
  watch: {
    // 当前点击
    i: function(){
        this.time = '';
        this.isPay = false;
        this.okList.forEach((item) => {
            if(item.substr(0, 2) == this.activeDate){
                this.isPay = true;
                this.time = item.substr(2, 4);
            }
            if(!this.f.length == 0 && this.f == this.activeDate){
                this.isPay = true;
                this.time = '';
            }
        })
    }
  },
  computed: {
    // 返回每月的天数
    days: function(){
      return new Date(this.year, parseInt(this.month, 10), 0).getDate();
    },
    countDay: function(){
        if(this.isClick){
            let index = this.k.indexOf(this.activeDate);
            this.number = this.cont_day[index];
            this.isClick = false;
            return this.cont_day[index];
        }else{
            return this.number;
        }
    }
  },
  methods: {
    // 日历的上翻页
    preMonth () {
      if(!this.isWatch){
            this.change();
        }
      if(this.month > 1){
        this.month--;
        this.i = '';
        if(this.month == new Date().getMonth()+1 && this.year == new Date().getFullYear()){
           this.i = new Date().getDate();
           this.d = [11];
        }
      }else{
        this.month = 12;
        this.year--;
        this.i = '';
      }
      
    },
    // 日历的下翻页
    nextMonth () {
        if(!this.isWatch){
            this.change();
        }
      this.d = '';
      if(this.month < 12){
        this.month++;
        this.i = '';
        if(this.month == new Date().getMonth()+1 && this.year == new Date().getFullYear()){
          this.i = new Date().getDate();
          this.d = [11];
        }
      }else{
        this.month = 1;
        this.year++;
        this.i = '';
      }
    },
    // 点击某一天
    click_date (n) {
      this.isClick = true;
      console.log(`click_dat--${n}`);
      this.i = n;
        let num = n;
        if(num < 10){
            num = '0' + num;
          }
      this.activeDate = n;
    },
    change () {
        this.isWatch = true;
        this.$watch('month', function(){
          this.r = [];
          this.k = [];
          this.f = [];
          this.okList= [];
          let year = new Date().getFullYear();
          let month = new Date().getMonth()+1;

          if( (this.year == year && this.month <= month) ||  this.year < year ){
            let m = this.month;
            if(m < 10){
                m = '0' + m;
            }
            this.$http.get(`http://clock.17link.cc/api/clock/date_clock?date=${this.year}-${m}`).then(res => {
                this.date_clock = res.data.data;
                this.k = [];
                this.f = [];
                this.r = [];
                this.date_clock.forEach(item => {
                    let countDay = item.cont_clock_day;
                    if(item.clock_time){
                        let d = item.clock_time.substr(8, 2);
                        let h = item.clock_time.substr(11, 2);
                        let m = item.clock_time.substr(14, 2);
                        let list = `${d}${h}${m}`;
                        this.okList.push(list);
                        if(Number.parseInt(d.substr(0, 1))){
                            this.k.push(parseInt(d.substr(0, 2)));
                        }else{
                            this.k.push(parseInt(d.substr(1, 1)));
                        }
                    }else{
                        let fail = item.date_time.substr(8 ,2);
                        if(Number.parseInt(fail.substr(0, 1))){
                            this.f.push(parseInt(fail.substr(0, 2)));
                        }else{
                            this.f.push(parseInt(fail.substr(1, 1)));
                        }
                    }
                    if(countDay <= 30){
                        if(countDay == 3 || countDay == 5 || countDay == 10 || countDay == 15 || countDay == 18 || countDay == 20 || countDay == 21 || countDay == 30){
                            this.r.push(Number.parseInt(item.clock_time.substr(8, 2)));
                            console.log(1);
                        }
                    }
                    else if( !(countDay - 30) % 10 ){
                        this.r.push(Number.parseInt(item.clock_time.substr(8, 2)));
                    }
                })
            })
            // console.log(this.k)
          }else{
              console.log('超过当前日期!')
              this.k = [];
              this.f = [];
          }
      })
    }
  },
  filters: {
      // 过滤器
      format: function(value) {
          if(value){
            return `${value.substr(0, 2)}:${value.substr(2,2)}`
          }  
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import "Details.css";
    @import "../../common/font/iconfont.css";
</style>