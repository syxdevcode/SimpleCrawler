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

        public async Task<Articles> Get(int Id)
        {
            return await _articlesRepository.Get(Id).FirstOrDefaultAsync();
        }

        public async Task<bool> GetByUrl(string url)
        {
            var result= await _articlesRepository.GetAll().AnyAsync(xx => xx.Url == url);

            return result;
        }

        public async Task<bool> Add(Articles articles)
        {
            _unitOfWork.RegisterNew<Articles>(articles);

            var result=await _unitOfWork.CommitAsync();
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

