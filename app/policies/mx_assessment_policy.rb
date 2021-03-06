class MxAssessmentPolicy
	attr_reader :current_user, :model

	def initialize(current_user, model)
		@current_user = current_user
		@mx_assessments = model
	end

	def create?
		@current_user.has_role? :admin3 or 
		@current_user.has_role? :admin2 or  
		@current_user.has_role? :bps_crud or
		@current_user.has_role? :bps_cru
	end	

	def destroy?
		@current_user.has_role? :admin3 or
		@current_user.has_role? :bps_crud
	end	

end