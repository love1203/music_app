import React, {Component} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity,View} from 'react-native';
import CodePush from "react-native-code-push";
import EventBus from "react-native-event-bus";

class App extends Component {
    constructor() {
        super();
        this.state = {
            restartAllowed: true,
            receivedBytes:0,
            totalBytes:1
        };
    }

    setPropress(){

        let viewbox=(parseInt(this.state.receivedBytes)/parseInt(this.state.totalBytes))*100+"%"
        
        return <TouchableOpacity style={{height:40,borderColor:'#333',borderWidth:1,margin:10}} onPress={this.sync.bind(this)}>
        <View style={{width:viewbox,height:'100%',backgroundColor:'blue'}}>
            
        </View>
    </TouchableOpacity>
    }

    codePushStatusDidChange(syncStatus) {
        
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE://检查更新
                this.setState({syncMessage: "Checking for update."});
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE://下载包
                this.setState({syncMessage: "Downloading package."});
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION://等待用户动作
                this.setState({syncMessage: "Awaiting user action."});
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE://安装更新
                this.setState({syncMessage: "Installing update."});
                break;
            case CodePush.SyncStatus.UP_TO_DATE://应用程式最新
                this.setState({syncMessage: "App up to date.", progress: false});
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED://用户取消了更新
                this.setState({syncMessage: "Update cancelled by user.", progress: false});
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED://已安装更新，将在重新启动时应用
                this.setState({syncMessage: "Update installed and will be applied on restart.", progress: false});
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR://出现未知错误
                this.setState({syncMessage: "An unknown error occurred.", progress: false});
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        console.log(progress)
        this.setState({
            receivedBytes:progress.receivedBytes?progress.receivedBytes:0,
            totalBytes:progress.totalBytes?progress.totalBytes:1
        })
        this.setState({progress});
    }

    toggleAllowRestart() {
        this.state.restartAllowed
            ? CodePush.disallowRestart()
            : CodePush.allowRestart();

        this.setState({restartAllowed: !this.state.restartAllowed});
    }

    getUpdateMetadata() {
        alert(JSON.stringify(CodePush.getCurrentPackage()))
        CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
            .then((metadata) => {
                this.setState({
                    syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version",
                    progress: false
                });
            }, (error) => {
                this.setState({syncMessage: "Error: " + error, progress: false});
            });
    }

    /** Update is downloaded silently, and applied on restart (recommended) */
    sync() {
        CodePush.sync(
            {},
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    /** Update pops a confirmation dialog, and then immediately reboots the app */
    syncImmediate() {
        CodePush.sync(
            {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    componentDidMount(){
        EventBus.getInstance().addListener('enentClick',this.funcClick=(data)=>{
            if(data.to==3){
                this.getCurrentPackage()
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener('enentClick',this.funcClick)
    }

    getCurrentPackage(){
        CodePush.checkForUpdate()
        .then(updata=>{
            if(updata){
                alert(JSON.stringify(updata))
            }else{
                alert('已经是最新版本')
            }
        })
    }

    

    render() {
        let progressView;

        if (this.state.progress) {
            progressView = (
                <Text
                    style={styles.messages}>{this.state.progress.receivedBytes} of {this.state.progress.totalBytes} bytes
                    received</Text>
            );
        }
        return (
            <View>
                <Text style={styles.welcome}>
                    Welcome1 to CodePush2!
                </Text>
                {this.setPropress()}
                <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
                    <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
                </TouchableOpacity>
                {progressView}
                <TouchableOpacity onPress={this.getCurrentPackage.bind(this)}>
                    <Text style={styles.syncButton}>更新内容</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
                    <Text
                        style={styles.restartToggleButton}>Restart {this.state.restartAllowed ? "allowed" : "forbidden"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
                    <Text style={styles.syncButton}>Press for Update Metadata</Text>
                </TouchableOpacity>
                <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewbox:{
        width:'10%',
        height:'100%',
        backgroundColor:'blue'
    },
    image: {
        margin: 30,
        width: Dimensions.get("window").width - 100,
        height: 365 * (Dimensions.get("window").width - 100) / 651,
    },
    messages: {
        marginTop: 30,
        textAlign: "center",
    },
    restartToggleButton: {
        color: "blue",
        fontSize: 17
    },
    syncButton: {
        color: "green",
        fontSize: 17
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 20
    },
});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

App = CodePush(codePushOptions)(App);

export default App;