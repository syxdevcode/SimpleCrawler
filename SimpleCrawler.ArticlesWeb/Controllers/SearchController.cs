using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SimpleCrawler.ArticlesWeb.Controllers
{
    public class SearchController : Controller
    {
        /// <summary>
        /// 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult SearchIndex()
        {
            return View();
        }

        /// <summary>
        /// 用户搜索建议
        /// </summary>
        /// <param name="keyWord"></param>
        /// <returns></returns>
        [HttpGet]
        public JObject SearchSuggestion(string keyWord)
        {
            JObject jobj = new JObject();
            JArray jarr = new JArray();
            jobj.Add("List", jarr);
            jobj.Add("ResultCount", 1);
            return jobj;
        }

        /// <summary>
        /// 获取搜索结果
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JObject GetSearchResult(string keyWord)
        {
            JObject jobj = new JObject();
            JArray jarr = new JArray();
            jobj.Add("List", jarr);
            jobj.Add("ResultCount", 1);
            return jobj;
        }
    }
}