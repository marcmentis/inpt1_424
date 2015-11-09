class StaticPagesPolicy < Struct.new(:current_user, :static_pages)
	
	def nav_notes?
		current_user.has_role? :admin3 or
		current_user.has_role? :nav_notes
	end

	def nav_trackers?
		current_user.has_role? :admin3 or
		current_user.has_role? :nav_trackers
	end

	def nav_patients?
		current_user.has_role? :admin3 or
		current_user.has_role? :nav_patients
	end

	def nav_admin?
		current_user.has_role? :admin3 or
		current_user.has_role? :admin2 or
		current_user.has_role? :admin1 or
		current_user.has_role? :nav_admin
	end

end