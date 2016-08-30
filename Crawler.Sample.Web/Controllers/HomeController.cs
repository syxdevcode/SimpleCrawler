using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.IoC.Contracts;
using Microsoft.Ajax.Utilities;
using Microsoft.Practices.Unity;
using Webdiyer.WebControls.Mvc;

namespace Crawler.Sample.Web.Controllers
{
    public class HomeController : Controller
    {
        private IArticlesService _IArticlesService= IocContainer.Default.Resolve<IArticlesService>();

        public ActionResult Index(int? id)
        {
            int pageIndex = id ?? 1;
            const int pageSize = 20;
            
            int total;
            var memberViews = _IArticlesService.GetPage(pageIndex,pageSize,out total);
            PagedList<Articles> model = new PagedList<Articles>(memberViews, pageIndex, pageSize, total);
            return View(model);
        }

        public ActionResult Search(string id = "", string kw = "", string isLike = "0", int pageIndex = 1)
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}