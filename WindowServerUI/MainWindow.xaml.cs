using System.Diagnostics;
using System.ServiceProcess;
using System.Windows;

namespace WindowServerUI
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnInstall_Click(object sender, RoutedEventArgs e)
        {
            string currentDirectory = System.Environment.CurrentDirectory;
            System.Environment.CurrentDirectory = currentDirectory + "\\Service";
            Process process = new Process();
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.FileName = "Install.bat";
            process.StartInfo.CreateNoWindow = true;
            process.Start();
            InstallLog.Text = "安装成功";
            System.Environment.CurrentDirectory = currentDirectory;
        }

        /// <summary>
        /// 卸载
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnunInstall_Click(object sender, RoutedEventArgs e)
        {
            string currentDirectory = System.Environment.CurrentDirectory;
            System.Environment.CurrentDirectory = currentDirectory + "\\Service";
            Process process = new Process();
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.FileName = "Uninstall.bat";
            process.StartInfo.CreateNoWindow = true;
            process.Start();
            InstallLog.Text = "卸载成功";
            System.Environment.CurrentDirectory = currentDirectory;
        }

        private void start_Click(object sender, RoutedEventArgs e)
        {
            ServiceController serviceController = new ServiceController("CrawlerService");
            serviceController.Start();
            stateLog.Text = "服务已启动";
        }

        private void stop_Click(object sender, RoutedEventArgs e)
        {
            ServiceController serviceController = new ServiceController("CrawlerService");
            if (serviceController.CanStop)
            {
                serviceController.Stop();
                stateLog.Text = "服务已停止";
            }
            else
            {
                stateLog.Text = "服务不能停止";
            }
        }

        private void btnPauseContinue_Click(object sender, RoutedEventArgs e)
        {
            ServiceController serviceController = new ServiceController("CrawlerService");
            if (serviceController.CanPauseAndContinue)
            {
                if (serviceController.Status == ServiceControllerStatus.Running)
                {
                    serviceController.Pause();
                    stateLog.Text = "服务已暂停";
                }
                else if (serviceController.Status == ServiceControllerStatus.Paused)
                {
                    serviceController.Continue();
                    stateLog.Text = "服务已继续";
                }
                else
                    stateLog.Text = "服务未处于暂停饿坏启动状态";
            }
            else
            {
                stateLog.Text = "服务不能暂停";
            }
        }

        /// <summary>
        /// 检查服务状态
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnCheckState_Click(object sender, RoutedEventArgs e)
        {
            ServiceController serviceController = new ServiceController("CrawlerService");
            state.Text = serviceController.Status.ToString();
        }
    }
}