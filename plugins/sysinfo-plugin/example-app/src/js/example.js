import { SysInfo } from 'sysinfo-plugin';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    SysInfo.echo({ value: inputValue })
}
