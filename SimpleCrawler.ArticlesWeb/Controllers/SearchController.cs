using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SimpleCrawler.ArticlesWeb.Controllers
{
    public class SearchController : Controller
    {
        [HttpGet]
        public ActionResult Search(string keyWord)
        {
            return View();
        }

    }
}
