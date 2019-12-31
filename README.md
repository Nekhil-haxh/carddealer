# CardDealer
Everything is attached here

Also in this section I am explaining the python code.



            if control_type == "distribute":
            
                # Expected params: [player]
                
                print(int(payload["player"]))
                
                self._distribute(int(payload["player"]))
                
                
In the above piece of code as you can see, when the players are set and if we say "distribute" command.It will call the distribute function from the if statement. In the function,the "x" variable(defines the angle of seperation of the distributing cards) and "n" variable(no. of rotations) will get a value according to the player values.You can adjust the speed percent and the rotations according to the card type. The fisrt negative rotations of medium motor will eject the card and the second positive rotations will level the deck. The whole cards will be distributed by the for and the nested for loops.
The "x=-x" expression reverse the distribution.


     def _distribute(self,player:int, is_blocking=False):

        """
        Handles distribute commands from the directive.
        Retrieves the player variable and starts distribution.
        
        """
        print("Distribute command: ({})".format(player), file=sys.stderr)#Print output
        x=300/player
        n=64/(player+1)
        for i in range(int(n)):
            for j in range(player-1):
                self.medium.on_for_rotations(SpeedPercent(50),-1.5)
                self.medium.on_for_rotations(SpeedPercent(50),1.5)
                self.large.on_for_degrees(5,x)
            x=-x
            
When we ask for the cards(the player variable should to be set).The cards you are asking has a value and the below if statement is executed.




            if control_type == "give":

                # Expected params: [value]
                print(int(payload["value"]))
                self._give(int(payload["value"]))
                
  Then it will call the give function as shown below and distribute the required cards by looking the value variale.
  
      def _give(self,value:int,is_blocking=False):
  
        print("Give command: ({})".format(value), file=sys.stderr)
        for j in range(value):
            self.medium.on_for_rotations(SpeedPercent(50),-1.5)
            self.medium.on_for_rotations(SpeedPercent(50),1.5)
            

            
