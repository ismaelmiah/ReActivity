using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using System;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Errors;
using System.Net;
using AutoMapper;

namespace Application.Activities
{
    public class details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var activity = await _context.Activities
                .FindAsync(request.Id);

                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not Found" });
                }

                var ActivityToReturn = _mapper.Map<Activity, ActivityDto>(activity);

                return ActivityToReturn;
            }
        }
    }
}