using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using BlogComm;
using SimpleCrawler;

namespace CnblogsArticlesDownLoad
{
    internal class Program
    {
        private static readonly string ImgUrl = WebConfigurationManager.AppSettings["FileUrl"].ToString();

        private static readonly List<CnblogsEntity> list;

        private static readonly BlogDal dal = BlogDal.Instance;

        private static string DomainName = String.Empty;

        #region Static Fields

        /// <summary>
        /// The settings.
        /// </summary>
        private static readonly CrawlSettings Settings = new CrawlSettings();

        /// <summary>
        /// The filter.
        /// 关于使用 Bloom 算法去除重复 URL：http://www.cnblogs.com/heaad/archive/2011/01/02/1924195.html
        /// </summary>
        private static BloomFilter<string> filter;

        private static volatile StringBuilder htmlBuilder = new StringBuilder();

        #endregion Static Fields

        #region Methods

        /// <summary>
        /// The main.
        /// </summary>
        /// <param name="args">
        /// The args.
        /// </param>
        private static void Main(string[] args)
        {
            CreateDataBase();
            BrowserCollection browserCollection = new BrowserCollection();

            List<string> urlList = browserCollection.GetBrowserCollectionsUrl();

            filter = new BloomFilter<string>(200000);

            // 设置种子地址
            //Settings.SeedsAddress.Add(string.Format("http://www.cnblogs.com/fenglingyi/p/4708006.html"));
            foreach (var url in urlList)
            {
                if (url.Length > 0)
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
            //master.DataReceivedEvent += SaveHtmlEvent;
            master.Crawl();

            //批量更新
            dal.BatchAddBlog(list);

            Console.ReadKey();
        }

        private static void CreateDataBase()
        {
            //初始化 博客上下文
            //var migrate = new CreateDatabaseIfNotExists<BlogContext>();
            //Database.SetInitializer(migrate);

            //Database.SetInitializer(new SampleData());
            //using (var db = new BlogContext())
            //{
            //    db.Database.Initialize(false);
            //}
            //using (var db = new BlogContext())
            //{
            //    Console.WriteLine("数据初始化完成：博客信息{0}条", db.CnblogsEntity.Count());
            //}
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
                Console.WriteLine(args.Url);
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
            // 在此处解析页面，可以用类似于 HtmlAgilityPack（页面解析组件）的东东、也可以用正则表达式、还可以自己进行字符串分析
            Uri domain = new Uri(args.Url);

            //http://www.cnblogs.com
            string domainUrl = domain.Scheme + "://" + domain.Host;
            DomainName = domain.Port == 80 ? domainUrl : domainUrl + ":" + domain.Port;

            htmlBuilder.Append(args.Html);
            DownloadAll(args.Html);

            //启用线程下载
            //System.Threading.Thread thread = new System.Threading.Thread(new System.Threading.ThreadStart(DownloadAll));
            //thread.Start();
        }

        /// <summary>
        /// 保存HTML
        /// </summary>
        /// <param name="args"></param>
        private static void SaveHtmlEvent(DataReceivedEventArgs args)
        {
            #region 不支持

            //HtmlDocument doc = new HtmlDocument();
            //doc.LoadHtml(args.Html);
            //HtmlNode rootNode = doc.DocumentNode;
            //string CategoryListXPath = "/title[1]";
            //var categoryNodeList = rootNode.SelectNodes(CategoryListXPath);

            #endregion 

            Regex reg = new Regex(@"(?m)<title[^>]*>(?<title>(?:\w|\W)*?)</title[^>]*>", RegexOptions.Multiline | RegexOptions.IgnoreCase);
            Match mc = reg.Match(args.Html);
            string m_title = String.Empty;
            if (mc.Success)
            {
                m_title = mc.Groups["title"].Value.Trim();
            }

            //定义正则表达式用来去除网页域名
            //Regex regImg = new Regex(@"\b(\S+)://(\S+)\b", RegexOptions.IgnoreCase);

            Regex urlRegex = new Regex(@"(?i)http://(\w+\.){1,3}(com(\.cn)?|cn|net)\b");

            //去除域名后
            var shtml = urlRegex.Replace(args.Html, "/File");

            if (dal.GetBlog(args.Url) == null)
            {
                CnblogsEntity entity = new CnblogsEntity();
                entity.AddDateTime = DateTime.Now;
                entity.BlogUrl = args.Url;
                entity.BlogTitle = m_title;
                entity.Content = shtml;

                //dal.AddBlog(entity);

                list.Add(entity);
            }
        }

        //下载
        private static void DownloadAll(string html)
        {
            List<string> fileList = GetHtmlFileList(html);

            if (null != fileList)
            {
                foreach (string s in fileList)
                {
                    try
                    {
                        string imgName = GetWebFileName(s);
                        //DownloadOneFileByURL(s, Globals.HttpPreUrl, Globals.LocalPrePath, 8000000);
                        DownloadOneFileByURLWithWebClient(imgName, s, ImgUrl);
                    }
                    catch { continue; }
                }
            }
        }

        /// <summary>
        /// 取得HTML中所有图片的 URL。
        /// </summary>
        /// <param name="htmlText">html代码</param>
        /// <returns>图片的URL列表</returns>
        private static List<string> GetHtmlImageList(string htmlText)
        {
            List<string> sUrlList = new List<string>();
            //定义正则表达式用来匹配 img 标签
            Regex regImg = new Regex(@"<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>", RegexOptions.IgnoreCase);
            //搜索匹配的字符串
            MatchCollection matches = regImg.Matches(htmlText);
            //取得匹配项列表
            foreach (Match match in matches)
            {
                string url = match.Groups["imgUrl"].Value;
                if (url.Contains("http"))
                    sUrlList.Add(url);
                else
                {
                    url = DomainName + url;
                    sUrlList.Add(url);
                }
            }
            return sUrlList;
        }

        /// <summary>
        /// 取得HTML中所有文件的 URL。
        /// </summary>
        /// <param name="htmlText">html代码</param>
        /// <returns>图片的URL列表</returns>
        private static List<string> GetHtmlFileList(string htmlText)
        {
            List<string> sUrlList = new List<string>();

            #region 匹配html图片

            //定义正则表达式用来匹配 img 标签
            Regex reg =
                new Regex(
                    @"<img\b[^<>]*?\bsrc[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>",
                    RegexOptions.IgnoreCase);
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
                    url = DomainName + url;
                    sUrlList.Add(url);
                }
            }

            #endregion 匹配html图片

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
                    url = DomainName + url;
                    sUrlList.Add(url);
                }
            }

            reg =
                new Regex(
                    @"<link\b[^<>]*?\bhref[\s\t\r\n]*=[\s\t\r\n]*[""']?[\s\t\r\n]*(?<imgUrl>[^\s\t\r\n""'<>]*)[^<>]*?/?[\s\t\r\n]*>",
                    RegexOptions.IgnoreCase);

            MatchCollection cssMatches = reg.Matches(htmlText);
            //取得匹配css列表
            foreach (Match match in cssMatches)
            {
                string url = match.Groups["imgUrl"].Value;
                if (url.Contains("http"))
                    sUrlList.Add(url);
                else
                {
                    url = DomainName + url;
                    sUrlList.Add(url);
                }
            }
            return sUrlList;
        }

        /// <summary>
        /// 调用浏览器网页另存为
        /// </summary>
        private void save()
        {
            string url = String.Empty;
            HttpRequest s = new HttpRequest("", url, "");
            s.SaveAs(url, true);
        }

        /// <summary>
        /// 获取网页文件名称
        /// </summary>
        /// <param name="imgUrl"></param>
        /// <returns></returns>
        private static string GetWebFileName(string imgUrl)
        {
            string fileName = imgUrl.Substring(imgUrl.LastIndexOf("/") + 1);
            if (fileName.Contains("?"))
                fileName = fileName.Substring(0, fileName.IndexOf("?"));
            return fileName;
        }

        /// <summary>
        /// HttpWebRequest Property
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="url"></param>
        /// <param name="localPath"></param>
        /// <param name="timeout"></param>
        private static void DownloadOneFileByURL(string fileName, string url, string localPath, int timeout)
        {
            System.Net.HttpWebRequest request = null;
            System.Net.HttpWebResponse response = null;
            request = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url + fileName);
            request.Timeout = timeout;//8000 Not work ?
            response = (System.Net.HttpWebResponse)request.GetResponse();
            Stream s = response.GetResponseStream();
            BinaryReader br = new BinaryReader(s);
            //int length2 = Int32.TryParse(response.ContentLength.ToString(), out 0);
            int length2 = Int32.Parse(response.ContentLength.ToString());
            byte[] byteArr = new byte[length2];
            s.Read(byteArr, 0, length2);
            if (File.Exists(localPath + fileName)) { File.Delete(localPath + fileName); }
            if (Directory.Exists(localPath) == false) { Directory.CreateDirectory(localPath); }
            FileStream fs = File.Create(localPath + fileName);
            fs.Write(byteArr, 0, length2);
            fs.Close();
            br.Close();
        }

        /// <summary>
        ///  下载文件，同时按照网页图片的路径，在指定目录下生成相关文件夹
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="url"></param>
        /// <param name="localPath"></param>
        private static void DownloadOneFileByURLWithWebClient(string fileName, string url, string localPath)
        {
            System.Net.WebClient wc = new System.Net.WebClient();
            string s = url.Substring(0, url.LastIndexOf("/"));
            string dicPath = String.Empty;
            if (url.Contains(DomainName))
            {
                dicPath = s.Replace(DomainName, localPath).Replace("/", @"\");
            }
            else
            {
                Uri imgUri = new Uri(url);
                string domainUrl = imgUri.Scheme + "://" + imgUri.Host;
                string imgDomain = imgUri.Port == 80 ? domainUrl : domainUrl + ":" + imgUri.Port;
                dicPath = s.Replace(imgDomain, localPath).Replace("/", @"\");
            }

            if (File.Exists(dicPath + fileName)) { File.Delete(dicPath + fileName); }
            if (Directory.Exists(dicPath) == false) { Directory.CreateDirectory(dicPath); }
            wc.DownloadFile(url, dicPath + "/" + fileName);
        }

        #endregion Methods
    }
}