package gomgook.paperdot.config.auth;

import gomgook.paperdot.member.entity.Member;
import gomgook.paperdot.member.repository.MemberRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        String requestURI = request.getRequestURI();
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                logger.error("JWT Token has expired", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (io.jsonwebtoken.MalformedJwtException e) {
                logger.error("Invalid JWT Token", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (Exception e) {
                logger.error("Unable to get JWT Token", e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");

            System.out.println(requestURI);

//            if (requestURI.startsWith("/api/ws")) {
//                System.out.println("ㅎㅇㅎㅇ");
//                chain.doFilter(request, response); // WebSocket 연결 허용
//                return;
//            }


            if (requestURI.startsWith("/api/bookmarks")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            Long memberId = jwtUtil.extractMemberId(jwtToken);
            Member member = memberRepository.findById(memberId).orElse(null);

            if (member != null && jwtUtil.validateToken(jwtToken, member)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

}
