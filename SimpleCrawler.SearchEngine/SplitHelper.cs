using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.PanGu;

namespace SimpleCrawler.SearchEngine
{
    public static class SplitHelper
    {
        /// <summary>
        /// 对keyword进行分词，将分词的结果返回
        /// </summary>
        public static IEnumerable<string> SplitWords(string keyword)
        {
            IList<string> list = new List<string>();
            System.IO.StringReader reader = new System.IO.StringReader(keyword);
            Analyzer analyzer = new PanGuAnalyzer();
            TokenStream tokenStream = analyzer.TokenStream("", reader);
            bool hasNext = tokenStream.IncrementToken();
            Lucene.Net.Analysis.Tokenattributes.ITermAttribute ita;
            while (hasNext)
            {
                //为当前分的词
                ita = tokenStream.GetAttribute<Lucene.Net.Analysis.Tokenattributes.ITermAttribute>();
                string word = ita.Term;
                hasNext = tokenStream.IncrementToken();
                list.Add(word);
            }
            tokenStream.CloneAttributes();
            reader.Close();
            analyzer.Close();
            return list;
        }
    }
}
