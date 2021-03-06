module SessionValues

	def authorized_and_confirmed
		if session[:confirmed] != 'authen_and_in_db'
			if Rails.env == 'development' 
				check_rsa_authorization_dev
				# puts "NOT AUTHORIZED AND CONFIRMED YET"
			elsif Rails.env == 'production' || Rails.env == 'test'
				check_rsa_authorization_prod
			end
		end
		# puts 'authorized_and_confirmed'
	end

	private
		def check_rsa_authorization_dev
			# Don't test rfc_authorized? - will NOT be, assign a 'session[:authen]'
			session[:authen] = 'pgmdmjm'
			# session[:authen] = 'pgtest1'
			# session[:authen] = 'pgtest2'
			app_authorized
			# browsers
				# browser = request.env['HTTP_USER_AGENT'].downcase
				# if browser.include? 'chrome'
				# 	browser_type = 'chrome'
				# elsif browser.include? 'trident'
				# 	browser_type = 'ie'
				# elsif browser.include? 'version'
				# 	browser_type = 'safari'
				# else
				# 	browser_type = 'unknown'		
				# end		
		end

		def check_rsa_authorization_prod
			# byebug
			if rfc_authorized? 
				session[:authen] = request.headers["HTTP_REMOTE_USER"]				
				app_authorized		
			else
				@error = 'User has not passed RSA authentication'
				render file: "#{Rails.root}/public/user_error", layout: false
			end		
		end

		def rfc_authorized?
			request.headers["HTTP_REMOTE_USER"].blank? ? false : true		
	  	end

	  	def app_authorized
  			this_user = current_user
			if this_user.blank?
				@error = 'User has no privileges in this application'
				render file: "#{Rails.root}/public/user_error", layout: false		
			else				
				session[:confirmed] = 'authen_and_in_db'
				session[:facility] = this_user.facility
				# session[:admin3] = this_user.has_role? :admin3
				session[:user_name] = ''+this_user.lastname+' '+this_user.firstinitial+''
			end	
	  	end
	
end