# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    # Allow both localhost and local network IPs to embed Rails in an iframe
    policy.frame_ancestors "http://localhost:5173", 
                           "http://127.0.0.1:5173",
                           "http://localhost:3000"

    # Uncomment and customize these if needed for security
    # policy.default_src :self, :https
    # policy.font_src    :self, :https, :data
    # policy.img_src     :self, :https, :data
    # policy.object_src  :none
    # policy.script_src  :self, :https
    # policy.style_src   :self, :https
    # Specify URI for violation reports
    # policy.report_uri "/csp-violation-report-endpoint"
  end
  config.content_security_policy_report_only = true
  # Generate session nonces for permitted importmap, inline scripts, and inline styles.
  # config.content_security_policy_nonce_generator = ->(request) { request.session.id.to_s }
  # config.content_security_policy_nonce_directives = %w(script-src style-src)

  # Report violations without enforcing the policy.
  # config.content_security_policy_report_only = true
end
