package com.project.lumos.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/* OncePerRequestFilter: 사용자의 요청에 한번만 동작하는 필터 */
public class JwtFilter extends OncePerRequestFilter{
	
	private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);
	
	public static final String AUTHORIZATION_HEADER = "Authorization";	//사용자가 request header에 Authorization속성으로 token을 넘긴 것. 
	public static final String BEARER_PREFIX = "Bearer";				//사용자가 던지는 token만 파싱하기 위한 접두사 저장용 변수(접두사는 Bearer 라는 표준으로 정의 됨)
	
	private final TokenProvider tokenProvider;
	
	@Autowired
	public JwtFilter(TokenProvider tokenProvider) {
		this.tokenProvider = tokenProvider;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		String jwt = resolveToken(request);			//요청에서 토큰값을 추출한다.
		
		//추출한 토큰이 유효한지 살펴본다. 유효하다면 SecurityContextHolder에 담는다.
		if(StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) { 
			Authentication authentication = tokenProvider.getAuthentication(jwt);
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		filterChain.doFilter(request, response);
	}
	
	/* Request Header에서 토큰 정보 꺼내기(위에 정의한 static final 변수 두개를 사용한다.)*/
	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader(AUTHORIZATION_HEADER);	
		if(StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) { 
			return bearerToken.substring(7);	//Bearer를 제외하고 7번째부터 자르면 토큰값이 된다.					
		}
		return null;
	}

}

