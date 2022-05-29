import {PureComponent} from 'react';
import { View, Text, Button, SwiperItem, ScrollView } from '@tarojs/components'
import IsLogin from '@/components/LoginDecorator';
import { connect } from 'react-redux'
import Tab from '@/components/Tab';
import NoExploit from '@/components/NoExploit';
import dayjs from 'dayjs';

import './index.scss'
import tools from '@/common/tools';
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import { orderListReq } from '@/common/api';
import { ERR_MSG } from '@/common/constant';

const TAB_LIST = [
  {label: '机票', tab: 'flight', id: 0},
  {label: '火车票', tab: 'train', id: 1},
  {label: '酒店', tab: 'hotel', id: 2},
  {label: '汽车票', tab: 'bus', id: 3}
];

const IS_BAIDU = tools.isBaidu
@connect(({ user }) => ({
  ...user
}))
@IsLogin
class Order extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      orderList: [],
      isRefresh: false
    }
  }
  componentDidMount() {
    const onShowEventId = this.$instance.router.onShow
    eventCenter.on(onShowEventId, this.onShow)
    this.getOrderList()
  }
  componentWillUnmount() {
    const onShowEventId = this.$instance.router.onShow
    eventCenter.off(onShowEventId, this.onShow)
  }
  $instance = getCurrentInstance()
  onShow = () => {
    if (this.props.isLogin) {
      this.getOrderList()
    }
  }
  toLogin = () => {
    tools.navigateTo({
      url: '/pages/login/index'
    })
  }
  onLoginOut = () => {
    try {
      Taro.removeStorageSync('userInfo')
      tools.showToast({
        title: '操作成功~',
        icon: 'loading',
        duration: 1000
      })
      this.props.dispatch({
        type: 'user/logout'
      })
    } catch(err) {
      tools.showToast('操作失败~')
    }
  }
  getOrderList = () => {
    tools.showLoading()
    const { userPhone } = this.props
    orderListReq({
      userPhone
    }).then(res => {
      const { data } = res
      this.setState({
        orderList: data || []
      })
    }).catch(err => {
      tools.showToast(err?.data?.message || ERR_MSG)
    }).finally(() => {
      tools.hideLoading()
      this.setState({
        isRefresh: false,
      })
    })
  }
  handlePullDownRefresh = () => {
    this.setState({
      isRefresh: true
    }, this.getOrderList)
  }
  renderListItem = () => {
    const { orderList, isRefresh } = this.state
    return orderList?.length ? (
      <ScrollView scrollY style={{height: '100%'}} className="order-list-box" refresherEnabled refresherTriggered={isRefresh} onRefresherRefresh={this.handlePullDownRefresh}>
        {orderList.map((item) => {
          const { dptCityName, arrCityName, dptTime, dptTimeStr, price } = item;
          return (
            <View key={item.id} className="item">
              <View className="left">
                <View className="line">
                  <Text className="city-name">{dptCityName}</Text> - 
                  <Text className="city-name">{arrCityName}</Text>
                  <View className="time">{`${dayjs(dptTime).format(
                    "YYYY-MM-DD"
                  )} ${dptTimeStr}`}</View>
                </View>
              </View>
              <View className="right">¥ {price}</View>
            </View>
          );
        })}
      </ScrollView>
    ) : (
      <NoExploit content="暂无数据" />
    );
  }
  render() {
    const { isLogin, nickName } = this.props
    return isLogin ? (
      <View className={`home-container ${IS_BAIDU ? 'baidu-home-container' : ''}`}>
        <View className="user-box">
          <Text className="user-name">欢迎，{nickName || "--"}</Text>
          <Text className="login-out-btn" onClick={() => this.onLoginOut()}>退出</Text>
        </View>
        <Tab tabList={TAB_LIST} className="tab">
          {TAB_LIST.map((tab) => {
            return (
              <SwiperItem key={tab.id}>
                {tab.id === 0 ? (this.renderListItem()) : (
                  <NoExploit content="暂无数据" />
                )}
              </SwiperItem>
            );
          })}
        </Tab>
      </View>
    ) : (
      <View className="no-login-container">
        <Text className="txt">登录查看订单</Text>
        <Button className="login-btn" onClick={() => this.toLogin()}>
          立即登录
        </Button>
      </View>
    );
  }
}

export default Order;
