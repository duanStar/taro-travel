import { Component } from 'react';
import { View, ScrollView, Text, Image, Block, Picker } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro';
import dayjs from 'dayjs';
import { MIN_DATE, MAX_DATE, ERR_MSG } from '@/common/constant'
import { weekDay } from '@/common/utils'
import Skeleton from 'taro-skeleton'
import 'taro-skeleton/dist/index.css'
import './index.scss'
import { flightListReq } from '@/common/api';
import tools from '@/common/tools';
import VirtualList from '@/components/VirtualList';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateList: this.formatDateList(),
      flightData: {},
      flightList: [],
      scrollTop: "",
      flightCompanyList: [],
      curAirCompanyIndex: ""
    }
  }
  componentDidMount() {
    const { params } = getCurrentInstance().router
    const { 
      arrCityName,
      dptCityName,
      dptDate,
      dptCityId,
      dptAirportName,
      arrAirportName,
      arrCityId
    } = params
    this.setState({
      flightData: { 
        arrCityName,
        dptCityName,
        dptDate,
        dptCityId,
        dptAirportName,
        arrAirportName,
        arrCityId
      }
    }, this.getList)
    Taro.setNavigationBarTitle({
      title: `${decodeURIComponent(dptCityName)} - ${decodeURIComponent(arrCityName)}`
    })
  }
  initFlightList = []
  formatDateList = () => {
    let minStr = dayjs(MIN_DATE).valueOf();
    const maxStr = dayjs(MAX_DATE).valueOf();
    const dayStr = 1000 * 60 * 60 * 24; // 一天
    let res = [];
    for (; minStr <= maxStr; minStr += dayStr) {
      res.push({
        dateStr: dayjs(minStr).format("YYYY-MM-DD"),
        day: dayjs(minStr).format("M-DD"),
        week: weekDay(minStr),
      });
    }
    return res;
  };
  onFlightClick = (flight) => {
    tools.navigateTo({
      url: '/pages/flight/detail/index',
      data: flight
    })
  }
  getList = () => {
    const { flightData } = this.state
    tools.showLoading()
    this.setState({
      scrollTop: ""
    })
    flightListReq(flightData).then(res => {
      const companyArr = res.data?.map(item => item.airCompanyName)
      this.setState({
        flightList: res.data,
        flightCompanyList: [...new Set(companyArr)],
        scrollTop: 0
      }, () => {
        this.initFlightList = res.data
      })
    })
      .catch(() => {
        tools.showToast(ERR_MSG)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }
  onAirCompanyChange = (e) => {
    const { value } = e.detail
    this.setState({
      scrollTop: ""
    })
    this.setState({
      curAirCompanyIndex: +value
    }, () => {
      const res = this.initFlightList.filter(item => item.airCompanyName === this.state.flightCompanyList[value])
      this.setState({
        flightList: res,
        scrollTop: 0
      })
    })
  }
  chooseDate = (dateStr) => {
    this.setState({
      flightData: {
        ...this.state.flightData,
        dptDate: dateStr
      }
    }, this.getList)
  }
  handleRender = (flight, index) => {
    const {dptTimeStr, dptAirportName, arrTimeStr, arrAirportName, price, airIcon, airCompanyName} = flight
    return <Block key={flight.id}>
      {
        index === 3 && (
          <View className="notice">
            <Image className="notice-logo" src="https://i.postimg.cc/dhGPDTjq/2.png"></Image>
            <Text className="notice-text">价格可能会上涨，建议尽快预定</Text>
          </View>  
        )
      }
      <View
        className="list-item"
        onClick={() => this.onFlightClick(flight)}
      >
        <View className="item-price">
          <View className="flight-row">
            <View className="depart">
              <Text className="flight-time">{dptTimeStr}</Text>
              <Text className="airport-name">
                {dptAirportName}
              </Text>
            </View>
            <View className="separator">
              <View className="spt-arr"></View>
            </View>
            <View className="arrival">
              <Text className="flight-time">{arrTimeStr}</Text>
              <Text className="airport-name">
                {arrAirportName}
              </Text>
            </View>
          </View>
          <Text className="flight-price color-red">
        ¥ {price}
          </Text>
        </View>
        <View className="air-info">
          <Image className="logo" src={airIcon} />
          <Text className="company-name">{airCompanyName}</Text>
        </View>
      </View>
    </Block>
  }
  render() {
    const { dateList, flightData, flightList, scrollTop, curAirCompanyIndex, flightCompanyList } = this.state
    const { dptDate } = flightData
    return (
      <View className="list-container">
        <View className="calendar-list">
          <ScrollView
            className="calendar-scroll-list"
            scrollX
            scrollWithAnimation
            scrollIntoView={`date-${dptDate}`}
          >
            {dateList.map((date) => {
              return (
                <View
                  key={date.dateStr}
                  className={`item ${
                    date.dateStr === dptDate ? "cur" : ""
                  }`}
                  id={`date-${date.dateStr}`}
                  onClick={() => this.chooseDate(date.dateStr)}
                >
                  <View className="date">{date.day}</View>
                  <View className="week">{date.week}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        {
          flightList.length ? (
            <View
              id="flight-list"
            >
              {/* 性能优化篇：虚拟列表 */}
              <VirtualList className="flight-scroll-list" list={flightList} onRender={this.handleRender} scrollViewProps={{
                scrollTop
              }}
              ></VirtualList>
            </View>
          ) : (
            <View className="skeleton-box">
              {Array(7)
                .fill(0)
                .map((item, index) => {
                  return <Skeleton key={index} row={3} action rowHeight={34} />;
                })}
            </View>
          )
        }
        <View className={`flilter-btn ${flightList?.length ? "" : "hidden"}`}>
          <Picker range={flightCompanyList} value={curAirCompanyIndex} onChange={(e) => this.onAirCompanyChange(e)}>筛选</Picker>
        </View>
      </View>
    );
  }
}

export default List;
