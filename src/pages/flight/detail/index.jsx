import { PureComponent } from 'react';
import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import dayjs from 'dayjs';
import withShare from '@/common/decorator/withShare';

import './index.scss'
import IsLogin from '@/components/LoginDecorator';
import { connect } from 'react-redux';
import tools from '@/common/tools';
import { orderReq } from '@/common/api';
import { ERR_MSG } from '@/common/constant';

@withShare({
  title: '我的行程分你一半，快乐同样分你一半～',
  imageUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180914%2Ff4b0c16e207e4fd0b686bf378a62989c.jpg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633356232&t=99c2f5e1ceb1b611976b1e28608aeee7'
})
@IsLogin
@connect(({ user }) => ({
  user
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedFlightData: {}
    }
  }
  componentDidMount() {
    const { params } = getCurrentInstance().router
    this.setState({
      selectedFlightData: {
        ...params
      }
    })
  }
  onOrder = () => {
    const { userPhone } = this.props.user
    const { selectedFlightData } = this.state
    tools.doLogin(() => {
      tools.showLoading()
      orderReq({
        userPhone,
        orderInfo: selectedFlightData
      }).then(() => {
        tools.showToast({
          title: '预定成功',
          icon: "loading",
          duration: 2000
        }).then(() => {
          Taro.switchTab({
            url: '/pages/order/index'
          })
        })
      })
        .catch(err => {
          tools.showToast(err?.data?.message || ERR_MSG)
        })
        .finally(() => {
          tools.hideLoading()
        })
    })
  }
  render() {
    const { 
      selectedFlightData,
      // isChecked
    } = this.state;
    const {
      airCompanyName,
      airIcon,
      arrAirportName,
      arrTimeStr,
      dptAirportName,
      dptTime,
      dptTimeStr,
      price,
    } = selectedFlightData;
    const {
      userPhone,
      nickName,
      isLogin
    } = this.props.user
    return (
      <View className="detail-container">
        <View className="flight-segment">
          <View className="info-head">
            <View className="tag">直飞</View>
            <View className="company-info">
              <Image src={airIcon} className="logo"></Image>
              {`${airCompanyName} ${dayjs(dptTime).format("M月D日")}`}
            </View>
          </View>
          <View className="info-detail">
            <View className="from">
              <View className="time">{dptTimeStr}</View>
              <View className="station">{dptAirportName}</View>
            </View>
            <Image
              className="mid"
              src="https://i.postimg.cc/z3P1QNf1/1.png"
            ></Image>
            <View className="to">
              <View className="time">{arrTimeStr}</View>
              <View className="station">{arrAirportName}</View>
            </View>
          </View>
        </View>
        <View className="passenger-box module-box">
          <Text className="title">乘机人</Text>
          {
            isLogin ? <View className="name">{nickName}</View> : <Button className="add-btn name" onClick={tools.doLogin}>新增</Button>
          }
        </View>
        <View className="passenger-box module-box">
          <Text className="title">联系手机</Text>
          <View className="phone-box">
            <Text className="num-pre">+86 </Text>
            <Input disabled placeholder="请输入乘机人手机号" value={userPhone}></Input>
          </View>
        </View>
        {/* 测试Taro bug */}
        {/* <Switch
          onChange={this.onSwitchChange}
        ></Switch>
        <View>
          {
            isChecked ? (
              <View className="module-box">
                <Text className="title">保险</Text>
                <View className="insurance-name">
                  <Text>人身意外险</Text>
                  <Text>¥ 30/人</Text>
                </View>
              </View>
            ) : null
          }
        </View> */}
        <View className="price-item">
          <View className="color-red">
            ¥ <Text className="price color-red">{price}</Text>
          </View>
          <View className="order-btn" onClick={this.onOrder}>订</View>
        </View>
        <Button className="share-btn" openType="share">快将行程分享给好友吧</Button>
        {/*  机票底部  */}
        <View className="flight-info"></View>
      </View>
    );
  }
}

export default Detail;
