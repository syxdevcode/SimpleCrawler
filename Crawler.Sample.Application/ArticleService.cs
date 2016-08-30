using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Crawler.Sample.Application.Interfaces;
using Crawler.Sample.Domain.Entity;
using Crawler.Sample.Infrastructure.Interfaces;
using Crawler.Sample.Repository.Interfaces;

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

        public IEnumerable<Articles> GetPage(int pageIndex, int pageSize, out int totalPage)
        {
            pageIndex = pageIndex == 0 ? 1 : pageIndex;
            totalPage = _articlesRepository.GetAll().Count();
            var result = _articlesRepository.GetAll().Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            return result;
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

