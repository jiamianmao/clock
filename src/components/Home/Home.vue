<template>
  <div class="container">
    <div class="home">
      <div class='reward' @click='isClick'>{{clock_info.sum_clock_day}}</div>
      
      <div class='avatar'>
       <router-link to='/details'><img :src="member_info.avatar"></router-link>
      </div>
      <div class='bird'>
        <img src="./before.gif" v-if='!isJoin'>
        <img src="./after.gif" v-else-if='isJoin && isSuccessful'>
        <img src="./normal.gif" v-else>
      </div>
      
      <!--  首屏中部的公告栏 （居中，左对齐   再修改下） -->
      <div class="bulletin">
        <h2>{{s_data.num}}人参加了明天的挑战，累计挑战金额{{s_data.num}}元</h2>
        <div class='rules'>
          <h3>挑战规则</h3>
          <ul>
            <li class='first'><span>支付一元加入挑战</span></li>
            <li class='second'><span>早上5:00-8:00打卡</span></li>
            <li class='last'><span>准时打卡平分挑战金</span></li>
          </ul>
        </div>
        <p><button class='clickdouble' @click='click_double'>点击翻倍</button></p>
        <p><button class='clockIn' @click='playcard'>{{ isJoin ? '打卡' : '参加挑战'}}</button></p>
        <p class='p_last'>下滑查看大家的打卡记录</p>
      </div>


      

      <!--  点击树莓的fade效果 -->
      <transition name='fade'>
        <div class='reward-state' v-show='flag'>
          <p v-if='clock_info.sum_clock_day > 0'>您已经连续打卡第{{clock_info.sum_clock_day}}天</p>
          <p v-else>连续早起才能收集树莓</p>
        </div>
      </transition>

      <!--  点击分享的fade效果 -->
      <transition name='fade'>
        <div class='reward-state' v-show='share'>
          <p>点击右上角分享给好友</p>
        </div>
      </transition>

      <!--  提示打卡时间的slide效果 -->
      <transition name='slide'>
        <div class='remind' v-show='isSlide'>
          <span>打卡时间 {{ currentHours < 5 ? '今天' : '明天'}}</span>
          <p>5:00-8:00</p>
        </div>
      </transition>

      <!--  点击打卡的动画效果 -->
      <transition enter-active-class="bounceIn" leave-active-class="bounceOut">
        <div class='modal_card animated' v-show='challenge'>
          <span @click='challenge = false,mask = false'><i class="iconfont icon-guanbi"></i></span>
          <div v-if='clock.status==-2'>
            <h2>支付挑战金1元</h2>
            <img src="./challenge_before.png">
            <p class='join'><button @click='toPay'>支付，参与挑战</button></p>
          </div>
          <div v-else>
            <h2>挑战成功!</h2>
            <p>奖励会在24小时内发送至微信红包<br>注意查收哦!</p>
            <img src="./challenge_after.png">
            <p class='join'><button @click='toPay'>支付，参与挑战</button></p>
            <p class='share'><button @click='click_share'>喊好友来参加</button></p>
          </div>
        </div>
      </transition>

      <!--  支付成功后 “挑战开启” 的提示动画效果 -->
      <transition enter-active-class="bounceIn" leave-active-class="bounceOut">
        <div class='modal_card animated' v-show='pay'>
          <span @click='mask = false, pay = false'><i class="iconfont icon-guanbi"></i></span>
          <!-- 这一块是报名参加之后的modal -->
          <div>
            <h2>你的挑战已开启</h2>
            <p>明天5:00-8:00记得来打卡哦</p>
            <img src="./challenge_ing.png">
            <p class='share'><button click='click_share'>喊好友来参加</button></p>
          </div>
        </div>
      </transition>

      <!--  点击 “点击翻倍” 的动画效果 -->
      <transition enter-active-class="bounceIn" leave-active-class="bounceOut">
        <div class='modal_share animated' v-show='isDouble' v-if='!isShare'>
          <span @click='isDouble = false, mask = false'><i class="iconfont icon-guanbi"></i></span>
          <div>
            <h2>你的奖金还未翻倍<br>分享即可获得翻倍奖金</h2>
            <p class='share_num'><img src="./money.png"> <i class='share_num-x iconfont icon-guanbi'></i> <span class='share_num-num'>1</span>倍</p>
            <p class='share_content'><img src="./fanbei.png" alt=""></p>
            <p class='share_text'>翻倍奖金由易保易报额外补贴</p>
            <img class='share_icon' src="./share_icon.png" @click='click_share'>
          </div>
        </div>
        <div class='modal_share animated' v-show='isDouble' v-else>
          <span @click='isDouble = false, mask = false'><i class="iconfont icon-guanbi"></i></span>
          <div>
            <h2>恭喜你<br>你的奖金已翻倍</h2>
            <p class='share_num'><img src="./money.png"> <i class='share_num-x iconfont icon-guanbi'></i> <span class='share_num-num'>2</span>倍</p>
            <p class='share_text'>翻倍后奖金会在24小时内 <br />发送至您的微信钱包</p>
            <p class='share_text'>翻倍奖金由易保易报额外补贴</p>
          </div>
        </div>
      </transition>

      <!--  一个遮罩层效果 -->
      <div class='mask' v-show='mask'>
      </div>
    </div>


    <div class="other_people">

      <div class='date border-1px'>
        <div class='left'>
          <img src="./calendar.png">
          <span>{{ yesterday }}</span>
        </div>
        <div class='right'>
          <span>{{s_data.history_clock_num}}成功</span>
          <span>{{s_data.history_num - s_data.history_clock_num}}失败</span>
        </div>
      </div>

      <div class="all_record my_record">
        <span class='record_time'>{{member_info.updated_at | getTime}}</span>
        <span class='record_avatr'><img :src="member_info.avatar"></span>
        <div class="record_content">
          <p>{{member_info.name}}连续打卡{{clock_info.sum_clock_day}}天</p>
          <div class='strawberry_container'>
            <span class='strawberry' v-for='item of clock_info.cont_clock_day'>
              <img src="./reward.png">
            </span>
          </div>
          <p>累计奖励{{clock_info.sum_price}}元</p>
        </div>    
      </div>

      <div class="all_record last-time">
        <span class='record_time'>08:00</span>
        <div class="record_content">
          <p>{{ today }}早起挑战结束</p>
        </div>
      </div>

      <div v-for='item of other_info'>
        <div class="all_record">
          <span class='record_time'>{{item.clock_time | getTime}}</span>
          <span class='record_avatr'><img :src="item.member.avatar"></span>
          <div class="record_content">
            <p>{{item.member.name}}连续打卡{{item.cont_clock_day}}天</p>
            <div class='strawberry_container'>
              <span class='strawberry' v-for='item of item.cont_clock_day'>
                <img src="./reward.png">
              </span>
            </div>
            <p>累计奖励{{item.reward_cont}}元</p>
          </div>      
        </div>
      </div>

      <div class="all_record last-time">
        <span class='record_time'>05:00</span>
        <div class="record_content">
          <p>{{ today }}早起挑战已经开始</p>
        </div>
      </div>

    </div>

    <div class='click_loading' @click='click_loading'>
      <p>点击加载更早的打卡记录</p>
    </div>

    <vue-loading type="spiningDubbles" color="#7d7c7d" :size="{ width: '20px', height: '20px' }" class='loading' v-show='loading'></vue-loading> 
    <p v-show='moredata' class='moredata'>没有更多数据...</p>
  </div>
</template>

<script>
import vueLoading from 'vue-loading-template'
export default {
  name: 'home',
  data () {
    return {
      s_data: {},
      member_info: {},
      other_info: [],
      page: 1,
      isShare: false,
      clock_info: '',
      clock_enlist: {},            // 存放支付信息的
      peopleNumber: 30000,      //  参与的人数
      flag: false,                // 监听是否点击树莓图标从而控制树莓的modal的显示与隐藏
      share: false,
      isSlide: false,           // 是否下拉slide来提示打卡时间
      isJoin: false,            // 是否参加挑战
      isSuccessful: false,                 // 是否挑战成功
      challenge: false,         // 挑战的 modal 的控制显示与隐藏
      mask: false,             // 遮罩层
      isDouble: false,
      pay: false,            // 监听支付成功
      currentHours: '',         // 用来判断提示打卡时间显示的是 '今天' or '明天'
      loading: false,       // 最下边 加载的按钮
      moredata: false,        // 最下边提示  没有更多数据
      clock: -2
    }
  },
  created () {
    this.$http.get('http://clock.17link.cc/api/member/info').then(res => {
      this.member_info = res.data;
    })
    this.$http.get('http://clock.17link.cc/api/clock/info').then(res => {
      this.clock_info = res.data.data;
    })
    this.$http.get('http://clock.17link.cc/api/clock/clock_list').then(res => {
      let arr = res.data.data;
      if(arr[arr.length-1].clock_time.substr(8, 2) == new Date().getDate()){
        this.other_info = arr;
      }else{
        arr.forEach(item => {
          if(item.clock_time.substr(8, 2) == new Date().getDate()){
            this.other_info.push(item);
          }
        })
      }
    })
    this.$http.get('http://clock.17link.cc/api/clock').then(res => {
      this.s_data = res.data;
    })
    this.$http.get('http://clock.17link.cc/api/clock/is_clock').then(res => {
      if(res.data.status == -1){
        this.isJoin = false;
      }else{
        this.isJoin = true;
      }
    })
    this.$http.get('http://clock.17link.cc/api/clock/clock').then(res => {
      if(res.data.status == 1){
        this.isSuccessful = true;
      }else{
        this.isSuccessful = false;
      }
    })
  },
  mounted () {
      let that = this;
      this.$http.get(`http://clock.17link.cc/wechat/wx_js_sdk?url=${encodeURIComponent(location.href.split('#')[0])}`).then(res => {
        let js_sdk = res.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: js_sdk.appId, // 必填，公众号的唯一标识
          timestamp: js_sdk.timestamp, // 必填，生成签名的时间戳
          nonceStr: js_sdk.nonceStr, // 必填，生成签名的随机串
          signature: js_sdk.signature,// 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function(){
          // console.log('开启sdk了');

          // 分享到朋友圈
          wx.onMenuShareTimeline({
              title: '赌你起不来，不服来战！', // 分享标题
              link: 'http://' + window.location.host, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: 'http://' + window.location.host + '/img/quan1.png', // 分享图标
              success: function () { 
                  // 用户确认分享后执行的回调函数
                  // window.location.reload(true);
                  that.isDouble = true;
                  that.mask = true;
                  that.isShare = true;
                  this.$http.get('http://clock.17link.cc/api/clock/share');
                  console.log('朋友圈分享成功');
              }
          });

          //  分享给好友
          wx.onMenuShareAppMessage({
              title: '赌你起不来，不服来战！',
              desc: '梦想总是要有的，万一实现了呢？',
              link: 'http://' + window.location.host,
              imgUrl: 'http://' + window.location.host + '/img/quan1.png',
              success: function(){
                that.isDouble = true;
                that.mask = true;
                that.isShare = true;
                this.$http.get('http://clock.17link.cc/api/clock/share');
                console.log('分享给朋友成功');
              }
          });
        })
      });
  },
  computed: {
    today: function(){
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return `${m}月${d}日`;
    },
    yesterday: function(){
      var now = new Date;
      now.setDate(now.getDate() - 1);
      var m = now.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = now.getDate();
      d = d < 10 ? "0" + d : d;
      return `${m}月${d}日`;
    }
  },
  methods: {
    isClick () {
      this.flag = true;
      setTimeout(() => { 
        this.flag = false;
      }, 3000)
    },
    playcard () {
      this.$http.get('http://clock.17link.cc/api/clock/clock').then(res => {      
        this.clock = res.data;      
        if(res.data.status == -1){
            this.currentHours = new Date().getHours();
            this.isSlide = true;
            setTimeout(() => { 
              this.isSlide = false;
            }, 3000)
        }else if(res.data.status == 1){
            this.challenge = true;
            this.mask = true;
        }else if(res.data.status == -2){
          this.challenge = true;
          this.mask = true;
        }
      })
    },
    click_double () {
        this.$http.get('http://clock.17link.cc/api/clock/is_clock').then(res => {
          if(res.data.status == -1){
            return;
          }else{
            if(res.data.data.multiple == 2){
              this.isShare = true;
              this.isDouble = true;
              this.mask = true;
            }else if(res.data.data.multiple == 1){
              this.isShare = false;
              this.mask = true;
              this.isDouble = true;
            }
          }
        })
    },
    click_share () {
      this.share = true;
      setTimeout(() => { 
        this.share = false;
      }, 3000)
    },
    click_loading () {
      this.loading = true;
      this.$http.get(`http://clock.17link.cc/api/clock/clock_list?page=${this.page}`).then(res => {
        this.loading = false;
        if(res.data.status == -1){
          this.moredata = true;
          setTimeout(() => {
            this.moredata = false;
          }, 1000);
        }else{
          if(res.data.data[res.data.data.length-1].clock_time.substr(8, 2) == new Date().getDate()){
            this.other_info = this.other_info.concat(res.data.data);
            this.page++;
          }else{
            res.data.data.forEach(item => {
              if(item.clock_time.substr(8, 2) == new Date().getDate()){
                this.other_info.push(item);
              }
            })
            this.moredata = true;
            setTimeout(() => {
              this.moredata = false;
            }, 1000);
          }
        }
      })
    },
    toPay () {
      this.$http.get('http://clock.17link.cc/api/clock/enlist').then(res => {
        this.clock_enlist = res.data;
        let appId = this.clock_enlist.config.appId;
        let timestamp = this.clock_enlist.config.timestamp;
        let nonceStr = this.clock_enlist.config.nonceStr;
        let package_config = this.clock_enlist.config.package;
        let signType = this.clock_enlist.config.signType;
        let paySign = this.clock_enlist.config.paySign;
        function onBridgeReady(){
          WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                  "appId": appId,     //公众号名称，由商户传入     
                  "timeStamp": timestamp,         //时间戳，自1970年以来的秒数     
                  "nonceStr": nonceStr, //随机串     
                  "package": package_config,     
                  "signType": signType,         //微信签名方式：     
                  "paySign": paySign     //微信签名 
              },
              function(res){
                  if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    window.location.reload(true);
                    this.challenge = false;
                    this.pay = true;
                    this.mask = true;
                    // alert('支付成功了');
                  }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
              }
          ); 
        }
        if (typeof WeixinJSBridge == "undefined"){
          if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
              document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        }else{
          onBridgeReady();
        } 
      })
    }
  },
  filters: {
    getTime: function(value){
      if(value){
        return value.substr(11, 5);
      }
    }
  },
  components: {
    vueLoading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "Home.css";
</style>
