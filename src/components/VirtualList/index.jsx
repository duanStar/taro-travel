import { ScrollView, View, Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Component } from 'react'

/**
 * 虚拟列表
 * @param {Array} list 列表数据
 * @param {Number} segmentNum 自定义分段数量，默认10
 * @param {Object} scrollViewProps scrollView参数
 * @param {Function} onComplete 二维列表已经全部加载完的回调
 * @param {Function} onRender 二维列表Item的渲染回调
 * @param {Function} onRenderBottom 二维列表下部分内容渲染回调
 * @param {Number} screenNum 指定页面显示区域基准值，默认2
 */

class VirtualList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      twoList: [],
      isComplete: false, //数据是否全部加载完成
      wholePageIndex: 0 //页数
    }
  }
  componentDidMount() {
    const { list } = this.props
    this.formatList(list)
    // this.getSystemInfo()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { list } = nextProps
    if (!list?.length) {
      this.handleComplete()
      return
    }
    if (JSON.stringify(list) !== JSON.stringify(this.props.list)) {
      this.pageHeightArr = []
      this.setState({
        twoList: [],
        isComplete: false,
        wholePageIndex: 0
      }, () => {
        this.formatList(list)
      })
    }
  }
  initList = [] //初始数据存放
  pageHeightArr = [] //每个维度渲染后所占高度
  $instance = Taro.getCurrentInstance()
  windowHeight = 0
  getSystemInfo() {
    try {
      const res = Taro.getSystemInfoSync()
      this.windowHeight = res?.screenHeight
    } catch(err) {
      console.log(err);
    }
  }
  formatList(list = []) {
    const { segmentNum } = this.props
    let arr = []
    let _list = []
    list.forEach((item, index) => {
      arr.push(item)
      if ((index + 1) % segmentNum === 0) {
        _list.push(arr)
        arr = []
      }
    })
    if (arr.length) {
      _list.push(arr)
      if (_list.length <= 1) {
        this.handleComplete()
      }
    }
    this.initList = _list
    this.setState({
      twoList: this.initList.slice(0, 1)
    }, () => {
      Taro.nextTick(() => {
        this.setHeight(list)
      })
    })
  }
  setHeight(list = []) {
    const { wholePageIndex } = this.state
    const { listId } = this.props
    const query = Taro.createSelectorQuery()
    query.select(`#${listId} .zt-main-list .wrap_${wholePageIndex}`).boundingClientRect()
    query.exec(res => {
      if (list?.length) {
        this.pageHeightArr.push(res?.[0]?.height)
      }
    })
    this.miniObserve()
  }
  miniObserve() {
    const { wholePageIndex } = this.state
    const { scrollViewProps, listId, screenNum } = this.props
    const scrollHeight = scrollViewProps?.style?.height || this.windowHeight
    const observer = Taro.createIntersectionObserver(this.$instance.page).relativeToViewport({
      top: screenNum * scrollHeight,
      bottom: screenNum * scrollHeight
    })
    observer.observe(`#${listId} .zt-main-list .wrap_${wholePageIndex}`, res => {
      const { twoList } = this.state
      if (res?.intersectionRatio <= 0) {
        twoList[wholePageIndex] = { height: this.pageHeightArr[wholePageIndex] }
        this.setState({
          twoList: [...twoList]
        })
      } else if (!twoList[wholePageIndex]?.length) {
        twoList[wholePageIndex] = this.initList[wholePageIndex]
        this.setState({
          twoList: [...twoList]
        })
      }
    })
  }
  handleComplete() {
    const { onComplete } = this.props
    this.setState({
      isComplete: true
    }, () => {
      onComplete?.()
    })
  }
  renderNext = () => {
    const { list, scrollViewProps } = this.props
    const page_index = this.state.wholePageIndex + 1
    if (!this.initList[page_index]?.length) {
      this.handleComplete()
      return
    }
    scrollViewProps?.onScrollToLower?.()
    this.setState({
      wholePageIndex: page_index
    }, () => {
      const { wholePageIndex, twoList } = this.state
      twoList[wholePageIndex] = this.initList[wholePageIndex]
      this.setState({
        twoList: [...twoList]
      }, () => {
        Taro.nextTick(() => {
          this.setHeight(list)
        })
      })
    })
  }
  render() {
    const { twoList, isComplete } = this.state
    const { segmentNum, scrollViewProps, onRender, onRenderBottom, className, listId } = this.props
    return <ScrollView className={`zt-virtual-list-container  ${className}`} scrollY id={listId} style={{height: '100%'}} onScrollToLower={this.renderNext} {...scrollViewProps}>
      <View className="zt-main-list">
        {
          twoList.map((item, pageIndex) => {
            return (
              <View key={pageIndex} className={`wrap_${pageIndex}`}>
                {
                  item?.length > 0 ? (<Block>
                    {
                      item.map((el, index) => {
                        return onRender?.(el, (pageIndex * segmentNum + index), pageIndex)
                      })
                    }
                  </Block>) : (
                    <View style={{height: `${item?.height}px`}}></View>
                  )
                }
              </View>
            )
          })
        }
      </View>
      {isComplete && onRenderBottom?.()}
    </ScrollView>
  }
}

VirtualList.defaultProps = {
  list: [],
  segmentNum: 10,
  scrollViewProps: {},
  className: "",
  screenNum: 2,
  listId: "zt-virtual-list",
  onRender: function() {
    return <View></View>
  }
}

export default VirtualList