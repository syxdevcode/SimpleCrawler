﻿using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Crawler.Sample.SearchEngine;
using Crawlwer.Sample.Common;
using log4net;
using Microsoft.Practices.Unity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.Configuration;

namespace Crawler.Sample.DownLoad
{
    internal class Program
    {
        #region Static Fields

        private static readonly ILog log = log4net.LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        private static readonly string ImgUrl = WebConfigurationManager.AppSettings["FileUrl"].ToString();

        private static readonly string sourceFile = WebConfigurationManager.AppSettings["sourceFile"].ToString();

        /// <summary>
        /// The settings.
        /// </summary>
        private static readonly CrawlSettings Settings = new CrawlSettings();

        /// <summary>
        /// The filter.
        /// 关于使用 Bloom 算法去除重复 URL：http://www.cnblogs.com/heaad/archive/2011/01/02/1924195.html
        /// </summary>
        private static BloomFilter<string> filter;

        private static IArticlesService _IArticlesService;

        // Lock对象，线程安全所用
        private static object syncRoot = new Object();

        #endregion Static Fields

        private static void Main(string[] args)
        {
            Crawler.Sample.BootStrapper.Startup.Configure();

            _IArticlesService = IocContainer.Default.Resolve<IArticlesService>();

            // 启动日志组件
            log4net.Config.XmlConfigurator.Configure();

            // 启动索引管理器
            IndexManager.Instance.Start();

            /*获取IE浏览器收藏夹中的URL
            //获取IE浏览器收藏夹中的URL
            BrowserCollection browserCollection = new BrowserCollection();
            List<string> urlList = browserCollection.GetBrowserCollectionsUrl();
            */

            List<string> urlList = GetHtmlUrlLink(ReadFile(sourceFile));
            //urlList.Add("http://www.ithao123.cn/content-4285584.html");
            //urlList.Add("http://www.cnblogs.com/yangecnu/p/Introduce-RabbitMQ.html");
            //urlList.Add("http://www.cnblogs.com/Andon_liu/p/5401961.html");
            //urlList.Add("http://www.cnblogs.com/lsjwq/p/5509096.html");
            //urlList.Add("http://www.cnblogs.com/kid-blog/p/4796355.html");
            //urlList.Add("http://www.cnblogs.com/ants/p/5122068.html");
            //urlList.Add("http://www.cnblogs.com/zery/p/5215572.html");
            //urlList.Add("http://www.cnblogs.com/JamesLi2015/p/4744008.html");
            //urlList.Add("http://www.cnblogs.com/kklldog/p/helios_chat_room.html");

            filter = new BloomFilter<string>(200000);

            foreach (var url in urlList)
            {
                var result = _IArticlesService.GetByUrl(url);
                if (url.Length > 0 && !result)
                {
                    Settings.SeedsAddress.Add(string.Format(url));
                }
            }

            // 设置 URL 关键字
            //Settings.HrefKeywords.Add(string.Format("/{0}/bj", CityName));
            //Settings.HrefKeywords.Add(string.Format("/{0}/sj", CityName));

            // 设置爬取线程个数
            Settings.ThreadCount = 5;

            // 设置爬取深度
            Settings.Depth = 1;

            // 设置爬取时忽略的 Link，通过后缀名的方式，可以添加多个
            //Settings.EscapeLinks.Add(".jpg");

            // 设置自动限速，1~5 秒随机间隔的自动限速
            Settings.AutoSpeedLimit = false;

            // 设置都是锁定域名,去除二级域名后，判断域名是否相等，相等则认为是同一个站点
            // 例如：mail.pzcast.com 和 www.pzcast.com
            Settings.LockHost = false;

            // 设置请求的 User-Agent HTTP 标头的值
            // settings.UserAgent 已提供默认值，如有特殊需求则自行设置

            // 设置请求页面的超时时间，默认值 15000 毫秒
            // settings.Timeout 按照自己的要求确定超时时间

            // 设置用于过滤的正则表达式
            // settings.RegularFilterExpressions.Add("");
            var master = new CrawlMaster(Settings);
            master.AddUrlEvent += MasterAddUrlEvent;
            master.DataReceivedEvent += MasterDataReceivedEvent;
            master.Crawl();

            Console.ReadKey();
        }

        /// <summary>
        /// The master add url event.
        /// </summary>
        /// <param name="args">
        /// The args.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        private static bool MasterAddUrlEvent(AddUrlEventArgs args)
        {
            if (!filter.Contains(args.Url))
            {
                filter.Add(args.Url);
                return true;
            }
            return false; // 返回 false 代表：不添加到队列中
        }

        /// <summary>
        /// The master data received event.
        /// </summary>
        /// <param name="args">
        /// The args.
        /// </param>
        private static void MasterDataReceivedEvent(DataReceivedEventArgs args)
        {
            Console.WriteLine(args.Url);
            Uri domain = new Uri(args.Url);

            string domainUrl = domain.Scheme + "://" + domain.Host;
            string domainName = domain.Port == 80 ? domainUrl : domainUrl + ":" + domain.Port;

            SaveHtmlEvent(args);
            DownloadAll(args.Html, domainName);
            //var task1 = Task.Run(() => DownloadAll(args.Html, domainName));
            //var task2 = Task.Run(() => SaveHtmlEvent(args));
            //Task.WaitAll(task1, task2);
        }

        /// <summary>
        /// 保存HTML
        /// </summary>
        /// <param name="args"></param>
        private static void SaveHtmlEvent(DataReceivedEventArgs args)
        {
            Regex reg = new Regex(@"(?m)<title[^>]*>(?<title>(?:\w|\W)*?)</title[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase);
            Match mc = reg.Match(args.Html);
            string m_title = String.Empty;
            if (mc.Success)
            {
                m_title = mc.Groups["title"].Value.Trim();
            }

            Regex urlRegex = new Regex(@"(?i)http://(\w+\.){1,3}(com(\.cn)?|cn|net)\b");

            //去除域名后
            var shtml = urlRegex.Replace(args.Html, "/File");
            try
            {
                lock (syncRoot)
                {
                    //更新数据库
                    Articles article = new Articles();
                    article.Id = PrimaryKeyGen.GuidToLongId();
                    article.IsDelete = false;
                    article.Url = args.Url;
                    article.Title = m_title;
                    article.Summary = m_title;
                    article.Content = shtml;
                    article.AddTime = DateTime.Now.ToString("yyyyMMdd hh:mm:ss");
                    var saveResult = _IArticlesService.Add(article);

                    if (saveResult)
                    {
                        // 更新索引库
                        IndexTask task = new IndexTask();
                        task.TaskId = article.Id;
                        task.Title = m_title;
                        //去除回车，空格，换行
                        task.Content = HtmlConverts.ConvertHtml(shtml).Replace("\n", "").Replace(" ", "").Replace("\t", "").Replace("\r", ""); ;
                        task.Summary = m_title;
                        IndexManager.Instance.AddArticle(task);
                    }
                }
            }
            catch (Exception ex)
            {
                log.ErrorFormat("Url:{0};\r\n错误信息{1}", args.Url, ex.InnerException.Message);
            }
        }

        /// <summary>
        /// 下载
        /// </summary>
        /// <param name="html"></param>
        private static void DownloadAll(string html, string domainName)
        {
            List<string> fileList = GetHtmlFileList(html, domainName);

            if (null != fileList)
            {
                foreach (string s in fileList)
                {
                    try
                    {
                        // 获取网页文件名称

                        string fileName = s.Substring(s.LastIndexOf("/") + 1);
                        if (fileName.Contains("?"))
                            fileName = fileName.Substring(0, fileName.IndexOf("?"));

                        DownloadFile(fileName, s, ImgUrl, domainName);
                    }
                    catch { continue; }
                }
            }
        }

        /// <summary>
        /// 取得HTML中所有文件的 URL。
        /// </summary>
        /// <param name="htmlText">html代码</param>
        /// <returns>图片的URL列表</returns>
        private static List<string> GetHtmlFileList(string htmlText, string domainName)
        {
            //htmlText = @"<img onload='if (this.width > 650) this.width = 650; ' title='7.png' alt='wKioL1Re6FvyXY59AAEB5AV5vKQ372.jpg'  style='float:none;' src='http://doc.ithao123.cn/uploads02/u02/ae/21/ae214b06abab26c0d9e264b453a08886.jpg' />";

            //htmlText = @"<img width='320' height='240' src = '/ images / pic.jpg' />";
            List<string> sUrlList = new List<string>();

            #region 匹配html图片

            //定义正则表达式用来匹配 img 标签
            Regex reg = new Regex(@"<img\b[^,]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>", RegexOptions.IgnoreCase);
            // 定义正则表达式用来匹配 img 标签
            //Regex re1 = new Regex(@"<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>", RegexOptions.IgnoreCase);
            //搜索匹配的字符串
            MatchCollection matches = reg.Matches(htmlText);
            //取得匹配图片列表
            foreach (Match match in matches)
            {
                string url = match.Groups["imgUrl"].Value;
                if (url.Contains("http"))
                    sUrlList.Add(url);
                else
                {
                    if (url.IndexOf("/") > 0) url = "/" + url;
                    url = domainName + url;
                    sUrlList.Add(url);
                }
            }

            #endregion 匹配html图片

            #region 取得匹配js列表

            reg =
                new Regex(
                    @"<script\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>",
                    RegexOptions.IgnoreCase);
            //搜索匹配的字符串
            MatchCollection jsMatches = reg.Matches(htmlText);
            //取得匹配js列表
            foreach (Match match in jsMatches)
            {
                string url = match.Groups["imgUrl"].Value;

                if (url.Contains("http"))
                    sUrlList.Add(url);
                else
                {
                    if (url.IndexOf("/") > 0) url = "/" + url;
                    url = domainName + url;
                    sUrlList.Add(url);
                }
            }

            #endregion 取得匹配js列表

            #region 取得匹配css列表

            reg =
                new Regex(
                    @"<link\b[^<>]*?\bhref[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>",
                    RegexOptions.IgnoreCase);

            MatchCollection cssMatches = reg.Matches(htmlText);
            //取得匹配css列表
            foreach (Match match in cssMatches)
            {
                string url = match.Groups["imgUrl"].Value;
                if (url.IndexOf("/") > 0) url = "/" + url;
                if (url.Contains("http"))
                    sUrlList.Add(url);
                else
                {
                    url = domainName + url;
                    sUrlList.Add(url);
                }
            }

            #endregion 取得匹配css列表

            return sUrlList;
        }

        /// <summary>
        ///  下载文件，同时按照网页图片的路径，在指定目录下生成相关文件夹
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="url"></param>
        /// <param name="localPath"></param>
        private static void DownloadFile(string fileName, string url, string localPath, string domainName)
        {
            System.Net.WebClient wClient = new System.Net.WebClient();
            string s = url.Substring(0, url.LastIndexOf("/"));
            string dicPath = String.Empty;
            Uri imgUri = new Uri(url);
            if (url.Contains(domainName))
            {
                dicPath = s.Replace(domainName, localPath).Replace("/", @"\");
            }
            else
            {
                string domainUrl = imgUri.Scheme + "://" + imgUri.Host;
                string imgDomain = imgUri.Port == 80 ? domainUrl : domainUrl + ":" + imgUri.Port;
                dicPath = s.Replace(imgDomain, localPath).Replace("/", @"\");
            }

            if (File.Exists(dicPath + "/" + fileName))
            {
                //File.Delete(dicPath + fileName);
                return;
            }
            log.InfoFormat("Url:{0};本地目录地址：{1}", url, dicPath);
            if (Directory.Exists(dicPath) == false) { Directory.CreateDirectory(dicPath); }
            wClient.DownloadFileAsync(imgUri, dicPath + "/" + fileName);
        }

        /// <summary>
        /// 读文件
        /// </summary>
        /// <param name="path">完整本地文件路径</param>
        /// <returns></returns>
        public static string ReadFile(string path)
        {
            try
            {
                StreamReader sr = new StreamReader(path,
                    System.Text.Encoding.GetEncoding("utf-8"));
                string content = sr.ReadToEnd().ToString();
                sr.Close();
                return content;
            }
            catch
            {
                return
                    "<span style='color:red; font-size:x-large;'>Sorry,The Ariticle wasn't found!! It may have been deleted accidentally from Server.</span>";
            }
        }

        /// <summary>
        /// 提取网页所有超链接和链接名称
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static List<string> GetHtmlUrlLink(string html)
        {
            //提取网页所有超链接和链接名称

            List<string> hrefList = new List<string>();//链接
            //List<string> nameList = new List<string>();//链接名称
            string strRef = @"<a[^<>]*?hrefs*=s*[,""s]([^"",]*)[,""][^<>]*?>(.*?)</a>";
            Regex re = new Regex(strRef, RegexOptions.IgnoreCase | RegexOptions.Singleline);

            MatchCollection matches = re.Matches(html);

            ArrayList ulist = new ArrayList();
            foreach (Match match in matches)
            {
                hrefList.Add(match.Groups[1].Value.Trim().ToLower());
                //nameList.Add(match.Groups[2].Value.Trim().ToLower());
            }
            return hrefList;
        }
    }
}