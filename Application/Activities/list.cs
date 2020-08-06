using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class list
    {
        public class ActivityEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }
        public class Query : IRequest<ActivityEnvelope>
        {
            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;

            }
            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityEnvelope>
        {
            private readonly DataContext _context;
            private readonly ILogger<list> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<list> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;

            }
            public async Task<ActivityEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                // try
                // {
                //     for (int i = 0; i < 1; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(500, cancellationToken);
                //         _logger.LogInformation($"Task {i} has Completed");
                //     }
                // }
                // catch (Exception ex) when (ex is TaskCanceledException)
                // {
                //     _logger.LogInformation("Task was Cancelled");
                // }

                var queryable = _context.Activities.AsQueryable();

                var activities = await queryable.Skip(request.Offset??0).Take(request.Limit??3).ToListAsync(); 

                return new ActivityEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count() 
                };
            }
        }
    }
}