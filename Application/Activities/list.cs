using System;
using System.Collections.Generic;
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
        public class Query : IRequest<List<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
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
            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    for (int i = 0; i < 1; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(500, cancellationToken);
                        _logger.LogInformation($"Task {i} has Completed");
                    }
                }
                catch (Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("Task was Cancelled");
                }
                var activities = await _context.Activities.Include(x => x.UserActivities).ThenInclude(y => y.AppUser)
                .ToListAsync(cancellationToken);

                var ReturnActivities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
                return ReturnActivities;
            }
        }
    }
}