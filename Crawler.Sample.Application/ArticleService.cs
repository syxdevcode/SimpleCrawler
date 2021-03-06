﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.Interfaces;
using Crawler.Sample.Repository.Interfaces;
using Crawler.Sample.SearchEngine;

namespace Crawler.Sample.Application
{
    public class ArticleService : IArticlesService
    {
        private IUnitOfWork _unitOfWork;

        private IArticlesRepository _articlesRepository;

        public ArticleService(IUnitOfWork unitOfWork, IArticlesRepository articlerepository)
        {
            _unitOfWork = unitOfWork;
            _articlesRepository = articlerepository;
        }

        public async Task<Articles> Get(long Id)
        {
            return await _articlesRepository.Get(Id).FirstOrDefaultAsync();
        }

        public bool GetByUrl(string url)
        {
            var result = _articlesRepository.GetAll().Any(xx => xx.Url == url);

            return result;
        }

        /// <summary>
        /// 首页分页方法
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public async Task<Tuple<int, IEnumerable<Articles>>> GetPage(int pageIndex, int pageSize)
        {
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            int totalPage = await _articlesRepository.GetAll().CountAsync();
            var result = await _articlesRepository.GetAll().OrderBy(o => o.AddTime).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
            Tuple<int, IEnumerable<Articles>> tuple = new Tuple<int, IEnumerable<Articles>>(totalPage, result);
            return tuple;
        }

        /// <summary>
        /// 搜索分页方法
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="isLike"></param>
        /// <returns></returns>
        public IEnumerable<SearchResult> GetPager(string kw, int pageIndex, int pageSize, string isLike,out int totalCount)
        {
            var list = SearchManager.Instance.Search("", kw, pageIndex, pageSize, out totalCount, isLike != "0");
            return list;
        }

        public bool Add(Articles articles)
        {
            _unitOfWork.RegisterNew<Articles>(articles);

            var result = _unitOfWork.Commit();
            return result;
        }

        public async Task<bool> BatchAdd(List<Articles> list)
        {
            foreach (var item in list)
                _unitOfWork.RegisterNew<Articles>(item);

            return await _unitOfWork.CommitAsync();
        }
    }
}

