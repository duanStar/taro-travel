import { PureComponent } from 'react';
import { View, SwiperItem, Button, Text, Swiper, Image } from '@tarojs/components';
import dayjs from 'dayjs';
import { connect } from 'react-redux'
import './index.scss';

import Tab from '@/components/Tab';
import NoExploit from '@/components/NoExploit'
import { adsReq } from '@/common/api'
import tools from '@/common/tools';
import Taro from '@tarojs/taro';

const FLIGHT_TABS = [
  {
    label: '单程',
    id: 0
  },
  {
    label: '多程',
    id: 1
  },
  {
    label: '往返',
    id: 2
  }
]

class FlightIndex extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isExchange: false,
      adList: []
    }
  }

  componentDidMount() {
    this.getAds()
    this.getLocationInfo()
  }

  getAds = () => {
    adsReq().then(res => { 
      this.setState({
        adList: res.data || []
      })
    })
  }

  handleTabClick(id) {
    console.log(id);
  }

  chooseFlightCity(type) {
    this.props.dispatch({
      type: 'flightIndex/updateState',
      payload: {
        cityType: type
      }
    })
    tools.navigateTo({
      url: '/pages/airportList/index'
    })
  }

  chooseFlightDate() {
    tools.navigateTo({
      url: '/pages/calendar/index'
    })
  }

  getLocationInfo = () => {
    Taro.getLocation({
      type: 'gcj02'
    }).then(res => {
      const {latitude, longitude} = res
      this.getCity({latitude, longitude})
    })
      .catch(() => {
        tools.showToast("位置获取失败")
      })
  }

  getCity = ({latitude, longitude}) => {
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?key=Y2CBZ-GFXWG-2NPQ5-I5Q7P-XTBEJ-FKFFO&location=${latitude},${longitude}`
    }).then(res => {
      const { data } = res
      const cityInfo = data?.result?.ad_info || {}
      this.props.dispatch({
        type: 'flightIndex/updateState',
        payload: {
          dptCityId: cityInfo.city_code || 2,
          dptCityName: cityInfo.city || '上海'
        }
      })
    }).catch(() => {
      tools.showToast("位置获取失败")
    })
  }

  onLinkToList = () => {
    const { 
      arrCityName,
      dptCityName,
      dptDate,
      dptCityId,
      dptAirportName,
      arrAirportName,
      arrCityId
    } = this.props.flightIndex
    tools.navigateTo({
      url: '/pages/flight/list/index',
      data: { 
        arrCityName,
        dptCityName,
        dptDate,
        dptCityId,
        dptAirportName,
        arrAirportName,
        arrCityId
      }
    })
  }

  render() {
    const { isExchange, adList } = this.state;
    const { arrCityName, dptCityName, dptDate } = this.props.flightIndex
    return <View className="flight-container">
      <View className="flight-top">
        <Tab tabList={FLIGHT_TABS} onTabClick={this.handleTabClick} className="flight-index-tab">
          {/* 单程 */}
          <SwiperItem>
            <View className="item station">
              <View
                className={`cell from ${isExchange ? "slide" : ""}`}
                onClick={() => this.chooseFlightCity("depart")}
              >
                {dptCityName}
              </View>
              <Text
                onClick={this.exchangeCity}
                className={`icon-zhihuan iconfont ${
                  isExchange ? "active" : ""
                }`}
              ></Text>
              <View
                className={`cell to ${isExchange ? "slide" : ""}`}
                onClick={() => this.chooseFlightCity("arrive")}
              >
                {arrCityName}
              </View>
            </View>
            <View className="item date" onClick={this.chooseFlightDate}>
              {dayjs(dptDate).format("M月D日")}
            </View>
            <Button className="search-btn" onClick={this.onLinkToList}>
                机票查询
            </Button>
          </SwiperItem>
          {/*  多程  */}
          <SwiperItem>
            <NoExploit className="no-data" />
          </SwiperItem>
          {/*  往返  */}
          <SwiperItem>
            <NoExploit className="no-data" />
          </SwiperItem>
        </Tab>
        <Swiper className="advs-banner-bd" autoplay indicatorDots circular interval={3000}>
          {
            adList.map(item => (<SwiperItem key={item.id} className="item"><Image className="img" src={item.imgUrl} /></SwiperItem>))
          }
        </Swiper>
      </View>
    </View>
  }
}

export default connect(({ flightIndex }) => ({
  flightIndex
}))(FlightIndex);
