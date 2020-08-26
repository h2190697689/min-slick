import React, {Fragment,Component ,PureComponent} from "react";
import PropTypes from "prop-types";
import "./slick.less";

class App extends Component{
    state = {
        list: [1,2,3,4,5,6,7,8,9],
        active: 0,  // 滚动下标
        itemStyle: {},
        wrapStyle: {

        }
    };
    timer = null;
    itemHeight= 0;  // 单个项高度
    itemUnit = "px";  // 高度单位
    outEle = React.createRef();
    wrapEle = React.createRef();

    static propTypes = {
        showNum: PropTypes.number,  // 可视区域，展示数量
        list: PropTypes.array,  // 需要展示的数据
        space: PropTypes.number // 时间间隔 毫秒
    };
    static defaultProps = {
        showNum: 5,
        space: 1000
    };

    /**
     * @desc 添加列表项
     */
    appendList=()=>{
        const { list } = this.state;
        this.setState({
            list: [...list, ...list]
        })
    };

    /**
     * @desc 调整num数量
     */
    adjustItemHeight = ()=>{
        const reg = /^(\d+)(\w+)$/;  // 匹配数字，及其单位
        const {showNum} = this.props;
        const outCurrent = this.outEle.current;
        // const itemCurrent = this.itemEle.current;
        const outHeight = window.getComputedStyle(outCurrent).height;
        const regList = reg.exec(outHeight);
        // console.log(regList[1]/showNum + regList[2]);
        const height = regList[1]/showNum + regList[2];
        this.itemHeight = regList[1]/showNum;
        this.itemUnit = regList[2];
        this.setState({
            itemStyle: {
                height
            }
        })
    };

    /**
     * @desc 滚动
     */
    scrollWrap=()=>{
        let { active, list } = this.state;
        const { space } = this.props;
        active++;
        let wrapStyle = {
            transform: `translateY(-${ active* this.itemHeight }${this.itemUnit})`,
            transition: `all ${space/1000}s`
        };
        if(active === Math)
        console.log(active);
        if(active === Math.floor(list.length/2)){
            setTimeout(()=>{
                this.setState({
                    active: 0,
                    wrapStyle: {}
                });
            }, space - 100)
        }
        this.setState({
            active,
            wrapStyle
        })
    };

    /**
     * @desc 浏览器窗口切换
     */
    adaptWindow=()=>{
        // 页面卸载前，暂时没有用
        // window.addEventListener("beforeunload",()=>{
        //     // console.log("*****beforeunload***")
        // });
        // 页面卸载时，暂时没有用
        // window.addEventListener('unload', function() {
        //     //窗口关闭后
        //     console.log('unload', new Date());
        // });
        // 浏览器页面切换
        const hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null;
        const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        window.document.addEventListener(visibilityChangeEvent,()=>{
            console.log("visibilitychange",document[hiddenProperty]);
            if(document[hiddenProperty]){
                this.stopPlay();
            } else {
                this.startPlay();
            }
        });
    };

    /**
     * @desc 窗体高度适应
     */
    adaptResize=()=>{
        window.addEventListener("resize", this.adjustItemHeight)
    };


    stopPlay=()=>{
        if(this.timer){
            clearInterval(this.timer)
        }
    };
    startPlay = ()=>{
        this.timer = setInterval(()=>{
            this.scrollWrap()
        }, 1000)
    };

    componentDidMount(){
        this.appendList();
        this.adjustItemHeight();
        this.startPlay();
        this.adaptWindow();
        this.adaptResize();
    };


    componentWillUnmount(){
        this.stopPlay();
        window.removeEventListener("resize", this.adjustItemHeight)
    }

    render(){
        const { list, itemStyle, wrapStyle, active } = this.state;
        return(
            <div ref={this.outEle} className="slick-out-wrap">
                <div className="slick-wrap" ref={this.wrapEle}
                     style={wrapStyle}
                     onMouseEnter={this.stopPlay}
                     onMouseLeave={this.startPlay}
                >
                    {
                        list.map((item,index)=>
                            <div key={index} style={itemStyle}
                                 className={active === index?
                                "slick-item active":"slick-item"}>
                                {item}
                            </div>
                        )
                    }
                </div>
            </div>
        )

    }
}

export default App;
