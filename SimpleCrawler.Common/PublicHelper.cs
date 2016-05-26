using System;
using log4net.Core;

namespace SimpleCrawler.Common
{
    /// <summary>
    /// 公共方法帮助类
    /// </summary>
    public class PulicHelper
    {
        #region 全局日志变量
        public static readonly log4net.ILog loginfo = log4net.LogManager.GetLogger("loginfo");
        public static readonly log4net.ILog logerror = log4net.LogManager.GetLogger("logerror");
        public static readonly log4net.ILog logmirror = log4net.LogManager.GetLogger("logmirror");
        #endregion
    }
}