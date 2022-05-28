import { PureComponent } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { airportCityListReq } from '@/common/api'
import tools from '@/common/tools'
import { ERR_MSG } from '@/common/constant'
import CityItem from './components/CityItem'

import './index.scss'

class AirportList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      letterList: [],
      currentLetter: ""
    }
  }
  componentDidMount() {
    this.getCityList()
  }
  getCityList = () => {
    tools.showLoading()
    const storageCityList = tools.getStorageSyncWithTime('cityList')
    if (storageCityList) {
      this.setState({
        cityList: storageCityList,
        letterList: Object.keys(storageCityList)
      })
      tools.hideLoading()
      return
    }
    airportCityListReq().then(res => {
      const cityList = this.formatList(res.data)
      tools.setStorageSyncWithTime("cityList", cityList, 60 * 60)
      this.setState({
        cityList,
        letterList: Object.keys(cityList)
      })
    }).catch(() => {
      tools.showToast(ERR_MSG)
    }).finally(() => {
      tools.hideLoading()
    })
  }
  formatList = (list) => {
    const res = {}
    if (list?.length) {
      list.forEach(item => {
        const firstLetter = item.firstLetter
        if (res[firstLetter]) {
          res[firstLetter].push(item)
        } else {
          res[firstLetter] = [item]
        }
      })
    }
    return res
  }
  onLetterClick = (letter) => {
    this.setState({
      currentLetter: letter
    })
  }
  render() {
    const { cityList, letterList, currentLetter } = this.state
    return (<View className="airport-list-container">
      <ScrollView scrollY scrollWithAnimation style={{height: '100vh'}} scrollIntoView={currentLetter}>
        {
          letterList?.map(letter => {
            const list = cityList[letter]
            return (
              <CityItem key={letter} cityList={list} label={letter}></CityItem>
            )
          })
        }
      </ScrollView>
      <View className="letter-container">
        {
            letterList?.map(item => (<View className="letter-item" key={item} onClick={() => this.onLetterClick(item)}>{item}</View>))
        }
      </View>
    </View>)
  }
}

export default AirportList;
