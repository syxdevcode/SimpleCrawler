using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SimpleCrawler.Data;
using Webdiyer.WebControls.Mvc;
using SimpleCrawler.Data.DAL;
using SimpleCrawler.Data.Entity;
using SimpleCrawler.SearchEngine;

namespace SimpleCrawler.ArticlesWeb.Controllers
{
    public class SearchController : Controller
    {
        /// <summary>
        /// 首页
        /// </summary>
        /// <param name="id"></param>
        /// <param name="keyWord"></param>
        /// <param name="isLike"></param>
        /// <returns></returns>
        public ActionResult SearchIndex(int? id, string keyWord = "", string isLike = "0")
        {
            string strKeyWorld = keyWord;
            int pageSize = 10;
            int totalCount = 0;
            int pageIndex = id ?? 1;
            string flag = "";
            bool _boolisLike = isLike == "1" ? true : false;
            List<SearchResult> storeInfoList = null;
            Stopwatch watch = new Stopwatch();
            watch.Start();//调用方法开始计时

            if (strKeyWorld.Length > 0)
            {
                storeInfoList = SearchManager.Instance.Search(flag, strKeyWorld, pageIndex, pageSize , out totalCount, _boolisLike);
            }
            watch.Stop();//调用方法计时结束
            double time = watch.Elapsed.TotalSeconds;//总共花费的时间
            ViewBag.time = time;
            ViewBag.kw = strKeyWorld;
            ViewBag._boolisLike = _boolisLike;
            if (storeInfoList == null)
            {
                return View();
            }
            PagedList<SearchResult> mPage = storeInfoList.AsQueryable().ToPagedList(pageIndex, pageSize);
            mPage.TotalItemCount = totalCount;

            mPage.CurrentPageIndex = (int)(id ?? 1);
            return View(mPage);
        }

        /// <summary>
        /// 用户搜索建议
        /// </summary>
        /// <param name="term"></param>
        /// <returns></returns>
        [HttpGet]
        public JArray SearchSuggestion(string term)
        {
            if (!string.IsNullOrEmpty(term))
                term = term.Trim();

            var list = SearchStasticsDal.Instance.SearchSuggestion(term);
            JArray jobj = new JArray();
            jobj.Add(list);
            return jobj;
        }


    }
}