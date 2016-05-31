﻿using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using SimpleCrawler.Data;
using SimpleCrawler.Data.DAL;
using SimpleCrawler.Data.Entity;
using Webdiyer.WebControls.Mvc;

namespace SimpleCrawler.ArticlesWeb.Controllers
{
    public class BlogsController : Controller
    {
        protected readonly ArticleDal dal = ArticleDal.Instance;

        public ActionResult IndexList(int? id)
        {
            int totalCount = 0;
            int pageIndex = id ?? 1;
            List<ArticleEntity> list = dal.GegEntitiesPageList("", out totalCount);
            PagedList<ArticleEntity> mPage = list.AsQueryable().ToPagedList(pageIndex, 20);
            mPage.TotalItemCount = totalCount;
            mPage.CurrentPageIndex = (int)(id ?? 1);
            return View(mPage);
        }

        [ValidateInput(true)]
        public ActionResult Index(int? id)
        {
            if (id != null)
            {
                ArticleEntity entity = dal.GetBlogById(id.Value);
                return View(entity);
            }
            else
            {
                return View(new ArticleEntity());
            }
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}