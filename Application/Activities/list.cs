using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class list
    {
        public class Query : IRequest<List<Activity>> { }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger<list> _logger;
            public Handler(DataContext context, ILogger<list> logger)
            {
                _logger = logger;
                _context = context;

            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                try{
                    for (int i = 0; i < 1; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(500, cancellationToken);
                        _logger.LogInformation($"Task {i} has Completed");
                    }
                }
                catch(Exception ex) when (ex is TaskCanceledException){
                    _logger.LogInformation("Task was Cancelled");
                }
                var activities = await _context.Activities.ToListAsync(cancellationToken);
                return activities;
            }
        }
    }
}