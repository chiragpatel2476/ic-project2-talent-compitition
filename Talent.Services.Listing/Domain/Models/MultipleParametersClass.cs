using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Talent.Services.Talent.Domain.Models
{
    public class MultipleParametersClass
    {
        public int activePage { get; set; }
        public string sortbyDate { get; set; }
        public bool showActive { get; set; }
        public bool showClosed { get; set; }
        public bool showDraft { get; set; }
        public bool showExpired { get; set; }
        public bool showUnexpired { get; set; }
        public string employerId { get; set; }
        public int limit { get; set; }
    }
}
